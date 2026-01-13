"use server";

import { Client } from "@notionhq/client";
import { generateTagsFromContent } from "@/lib/gemini";
import { brainDumpInputSchema, brainDumpTagsSchema } from "@/lib/validations";
import { getUserPreferences } from "./userPreferences";

/**
 * Helper to get a Notion client and database ID for a specific user
 */
async function getNotionConfig(userId: string) {
  const preferences = await getUserPreferences(userId);
  
  const token = preferences?.notionApiKey || process.env.NOTION_TOKEN;
  const databaseId = preferences?.notionDatabaseId || process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    throw new Error("Configuração do Notion não encontrada (Token ou Database ID ausente)");
  }

  const client = new Client({ auth: token });
  return { client, databaseId };
}

/**
 * Gera sugestões de tags usando o Gemini
 */
export async function generateBrainDumpTags(
  content: string,
  userApiKey?: string
) {
  try {
    const validatedInput = brainDumpInputSchema.parse({ content });
    const cleanContent = validatedInput.content.replace(/<[^>]*>/g, "");

    const tags = await generateTagsFromContent(cleanContent, userApiKey);
    const validatedOutput = brainDumpTagsSchema.parse({ tags });

    return { success: true, tags: validatedOutput.tags };
  } catch (error) {
    console.error("Erro na geração de tags:", error);
    return { success: false, tags: ["Geral"] };
  }
}

/**
 * Busca as tags utilizadas recentemente no Notion do usuário
 */
export async function getRecentNotionTags(userId: string) {
  try {
    const { client, databaseId } = await getNotionConfig(userId);

    const response = await client.databases.retrieve({
      database_id: databaseId,
    });

    if (!("properties" in response)) {
      return { success: false, tags: [] };
    }

    const fullResponse = response as { properties: Record<string, unknown> };
    const tagsProperty = fullResponse.properties["Tags"] as {
      type: string;
      multi_select: { options: { name: string }[] };
    };
    
    if (tagsProperty?.type === "multi_select") {
      const tags = tagsProperty.multi_select.options.map(
        (opt: { name: string }) => opt.name
      );
      return { success: true, tags };
    }

    return { success: true, tags: [] };
  } catch (error) {
    console.error("Erro ao buscar tags do Notion:", error);
    return { success: false, tags: [] };
  }
}

/**
 * Converte HTML básico do Tiptap para blocos do Notion
 */
function htmlToNotionBlocks(html: string): unknown[] {
  const blocks: unknown[] = [];
  const tagRegex = /<(p|h1|h2|h3|ul|ol|li)>(.*?)<\/\1>/g;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const [_, tag, content] = match;
    const cleanContent = content.replace(/<[^>]*>/g, "");

    if (tag === "p") {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: cleanContent.substring(0, 2000) } }],
        },
      });
    } else if (tag === "h1" || tag === "h2" || tag === "h3") {
      const type = tag === "h1" ? "heading_1" : tag === "h2" ? "heading_2" : "heading_3";
      blocks.push({
        object: "block",
        type: type,
        [type]: {
          rich_text: [{ type: "text", text: { content: cleanContent.substring(0, 2000) } }],
        },
      });
    } else if (tag === "li") {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: cleanContent.substring(0, 2000) } }],
        },
      });
    }
  }

  if (blocks.length === 0) {
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: html.replace(/<[^>]*>/g, "").substring(0, 2000) } }],
      },
    });
  }

  return blocks;
}

export async function syncBrainDumpToNotion(
  userId: string,
  htmlContent: string,
  title: string = "Brain Dump Polaris",
  tags: string[] = []
) {
  try {
    const { client, databaseId } = await getNotionConfig(userId);
    const blocks = htmlToNotionBlocks(htmlContent) as unknown[];

    const response = await client.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Nome: {
          title: [
            {
              text: {
                content: `${title} - ${new Date().toLocaleDateString("pt-BR")}`,
              },
            },
          ],
        },
        Tags: {
          multi_select: tags.map((tag) => ({ name: tag })),
        },
      },
      children: blocks.slice(0, 100) as never[],
    });

    return { success: true, url: (response as { url: string }).url };
  } catch (error: unknown) {
    console.error("Erro ao sincronizar com Notion:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    const notionError = error as { body?: { message?: string } };
    return { success: false, error: notionError.body?.message || errorMessage };
  }
}
