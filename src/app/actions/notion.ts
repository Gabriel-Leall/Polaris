"use server";

import { Client } from "@notionhq/client";
import { generateTagsFromContent } from "@/lib/gemini";
import { brainDumpInputSchema, brainDumpTagsSchema } from "@/lib/validations";

const notion = new Client({
  auth: process.env.NOTION_TOKEN || "",
});

/**
 * Gera sugestões de tags usando o Gemini
 */
export async function generateBrainDumpTags(
  content: string,
  userApiKey?: string
) {
  try {
    // Validação de entrada com Zod
    const validatedInput = brainDumpInputSchema.parse({ content });
    const cleanContent = validatedInput.content.replace(/<[^>]*>/g, "");

    // Passamos a chave do usuário se existir, senão usa a do env
    const tags = await generateTagsFromContent(cleanContent, userApiKey);

    // Validação de saída com Zod
    const validatedOutput = brainDumpTagsSchema.parse({ tags });

    return { success: true, tags: validatedOutput.tags };
  } catch (error) {
    console.error("Erro na geração de tags:", error);
    return { success: false, tags: ["Geral"] };
  }
}

/**
 * Busca as tags utilizadas recentemente no Notion para sugestão/autocomplete
 */
export async function getRecentNotionTags() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) return { success: false, tags: [] };

    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    // Verificação de tipo para o Notion SDK e acesso seguro às propriedades
    if (!("properties" in response)) {
      return { success: false, tags: [] };
    }

    const fullResponse = response as any;
    const tagsProperty = fullResponse.properties["Tags"];
    if (tagsProperty?.type === "multi_select") {
      const tags = tagsProperty.multi_select.options.map(
        (opt: any) => opt.name
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
function htmlToNotionBlocks(html: string): any[] {
  const blocks: any[] = [];

  // Regex simples para capturar parágrafos, títulos e listas
  // Nota: Para um SaaS real, usaríamos um parser de HTML robusto
  const tagRegex = /<(p|h1|h2|h3|ul|ol|li)>(.*?)<\/\1>/g;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const [_, tag, content] = match;
    const cleanContent = content.replace(/<[^>]*>/g, ""); // Remove tags internas como strong/em por enquanto

    if (tag === "p") {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: cleanContent.substring(0, 2000) },
            },
          ],
        },
      });
    } else if (tag === "h1" || tag === "h2" || tag === "h3") {
      const type =
        tag === "h1" ? "heading_1" : tag === "h2" ? "heading_2" : "heading_3";
      blocks.push({
        object: "block",
        type: type,
        [type]: {
          rich_text: [
            {
              type: "text",
              text: { content: cleanContent.substring(0, 2000) },
            },
          ],
        },
      });
    } else if (tag === "li") {
      // Tiptap coloca li dentro de ul/ol, mas o Notion quer li direto
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: cleanContent.substring(0, 2000) },
            },
          ],
        },
      });
    }
  }

  // Se não encontrou nada (ex: texto sem tags), envia como parágrafo único
  if (blocks.length === 0) {
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: html.replace(/<[^>]*>/g, "").substring(0, 2000) },
          },
        ],
      },
    });
  }

  return blocks;
}

export async function syncBrainDumpToNotion(
  htmlContent: string,
  title: string = "Brain Dump Polaris",
  tags: string[] = []
) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID não encontrado no ambiente");
    }

    const blocks = htmlToNotionBlocks(htmlContent);

    const response = await notion.pages.create({
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
      children: blocks.slice(0, 100), // Notion permite até 100 blocos por chamada
    });

    return { success: true, url: (response as any).url };
  } catch (error: any) {
    console.error("Erro ao sincronizar com Notion:", error);
    return { success: false, error: error.body?.message || error.message };
  }
}
