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
  
  const token = preferences?.notionApiKey;
  const databaseId = preferences?.notionDatabaseId;

  if (!token) {
    throw new Error("Notion não conectado. Por favor, vá em configurações e conecte sua conta.");
  }

  if (!databaseId) {
    throw new Error("Banco de dados do Notion não selecionado. Por favor, escolha um nas configurações.");
  }

  const client = new Client({ 
    auth: token,
    notionVersion: "2025-09-03",
  });
  return { client, databaseId };
}

export async function getNotionAuthUrl() {
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/notion/callback`;
  
  if (!clientId) {
    throw new Error("NOTION_CLIENT_ID não configurado no servidor.");
  }

  return `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

export async function exchangeNotionCodeForToken(code: string) {
  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/notion/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("Credenciais do Notion (ID/Secret) não configuradas.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Falha ao trocar código pelo token");
  }

  return {
    accessToken: data.access_token,
    workspaceName: data.workspace_name,
    workspaceIcon: data.workspace_icon,
    botId: data.bot_id,
    duplicatedTemplateId: data.duplicated_template_id,
  };
}

export async function listNotionDatabases(userId: string) {
  try {
    const preferences = await getUserPreferences(userId);
    const token = preferences?.notionApiKey;

    if (!token) {
      return { success: false, error: "Notion não conectado." };
    }

    const client = new Client({ auth: token });
    
    // Buscamos sem filtros restritivos para garantir que tudo o que a conexão vê seja retornado
    const response = await client.search({
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    });
    
    const databases = response.results
      .map((item: any) => {
        let title = "Sem título";
        const type = item.object;
        
        if (type === "database") {
          title = item.title?.[0]?.plain_text || item.title?.[0]?.text?.content || "Database sem nome";
        } else if (type === "page") {
          const titleProp = Object.values(item.properties || {}).find((p: any) => p.type === "title") as any;
          title = titleProp?.title?.[0]?.plain_text || titleProp?.title?.[0]?.text?.content || "Página sem nome";
        } else if (type === "data_source") {
          // O tipo data_source geralmente tem o nome em um lugar diferente
          title = item.name || item.data_source?.name || "Fonte de Dados";
        }

        if (type === "database" || type === "page" || type === "data_source") {
          return { id: item.id, title: title };
        }
        return null;
      })
      .filter((item): item is { id: string; title: string } => item !== null);

    return { success: true, databases };

    return { success: true, databases };
  } catch (error) {
    console.error("Erro ao listar bases do Notion:", error);
    return { success: false, error: "Falha ao buscar bases de dados." };
  }
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

    // Tenta descobrir o tipo do alvo e resolver o ID correto para o 'parent'
    let resolvedId = databaseId;
    let targetType: "database_id" | "data_source_id" | "page_id" = "database_id";
    let titlePropName = "title";
    let propertiesSchema: any = {};

    try {
      // 1. Tenta tratar como Database
      const db = (await client.databases.retrieve({ database_id: databaseId })) as any;
      propertiesSchema = db.properties;
      
      if (db.data_sources && db.data_sources.length > 0) {
        // Se tem data_sources (novo padrão), pegamos a primeira
        targetType = "data_source_id";
        resolvedId = db.data_sources[0].id;
      } else {
        targetType = "database_id";
      }
    } catch (e) {
      try {
        // 2. Se falhar, tenta tratar diretamente como Data Source
        const ds = (await (client as any).dataSources.retrieve({ data_source_id: databaseId })) as any;
        targetType = "data_source_id";
        resolvedId = databaseId;
        propertiesSchema = ds.properties;
      } catch (e2) {
        // 3. Se falhar ambos, assume que é uma Página pai (onde blocos serão filhos)
        targetType = "page_id";
      }
    }

    // Configura as propriedades com base no esquema encontrado
    const properties: any = {};
    const dateStr = new Date().toLocaleDateString("pt-BR");
    const displayTitle = title; // Remove a data do título

    if (targetType !== "page_id") {
      // Busca o nome da propriedade de título dinamicamente
      titlePropName = Object.keys(propertiesSchema).find(
        (key) => propertiesSchema[key].type === "title"
      ) || "title";
      
      properties[titlePropName] = {
        title: [{ text: { content: displayTitle } }],
      };
      
      // Verifica se existe campo de Tags (multi_select) - agora mais flexível
      const tagsPropName = Object.keys(propertiesSchema).find(
        (key) => propertiesSchema[key].type === "multi_select" && 
                 (key.toLowerCase().includes("tag") || key.toLowerCase().includes("etiqueta"))
      );

      if (tagsPropName && tags.length > 0) {
        properties[tagsPropName] = {
          multi_select: tags.map((tag) => ({ name: tag })),
        };
      }
    } else {
      // Se for apenas uma página pai
      properties["title"] = {
        title: [{ text: { content: displayTitle } }],
      };
    }

    // Adiciona a data como um "bloco de metadados" no início do conteúdo
    const metaBlocks = [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            { 
              type: "text", 
              text: { content: `📅 Data: ${dateStr}` },
              annotations: { italic: true, color: "gray" }
            }
          ],
        },
      }
    ];

    const parent: any = {};
    parent[targetType] = resolvedId;

    const response = await client.pages.create({
      parent,
      properties,
      children: [...metaBlocks, ...blocks].slice(0, 100) as never[],
    });

    return { success: true, url: (response as { url: string }).url };
  } catch (error: unknown) {
    console.error("Erro ao sincronizar com Notion:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return { success: false, error: errorMessage };
  }
}
