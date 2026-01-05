"use server";

import { Client } from "@notionhq/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const notion = new Client({
  auth: process.env.NOTION_TOKEN || "",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Gera sugestões de tags usando o Gemini
 */
export async function generateBrainDumpTags(content: string) {
  try {
    // Tente usar o modelo mais estável
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analise o seguinte texto de uma nota pessoal e sugira exatamente 3 tags curtas (uma palavra cada) para categorizá-la. Retorne apenas as tags separadas por vírgula, sem explicações. Texto: ${content
      .replace(/<[^>]*>/g, "")
      .substring(0, 1000)}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    const tags = response
      .text()
      .split(",")
      .map((tag) => tag.trim().replace(/#/g, ""));

    return { success: true, tags };
  } catch (error) {
    console.error("Erro Gemini:", error);
    return { success: false, tags: ["Geral"] };
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
