import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const defaultApiKey = process.env.GEMINI_API_KEY_TAG_REVIEW || "";

const brainDumpTagsSchema = {
  type: SchemaType.OBJECT,
  properties: {
    tags: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
      description:
        "A list of 3 short tags (one word each) to categorize the note content.",
    },
  },
  required: ["tags"],
};

export const generateTagsFromContent = async (
  content: string,
  userApiKey?: string
): Promise<string[]> => {
  const apiKey = userApiKey || defaultApiKey;

  if (!apiKey) {
    console.warn("Gemini API Key not found. Returning fallback tags.");
    return ["Geral"];
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: brainDumpTagsSchema,
      },
      systemInstruction:
        "You are a helpful assistant that categorizes personal notes with short, relevant tags.",
    });

    const prompt = `
      Analyze the following text and suggest exactly 3 short tags (one word each) to categorize it.
      Text: ${content.substring(0, 1000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    if (!jsonText) return ["Geral"];

    const parsed = JSON.parse(jsonText);
    return parsed.tags || ["Geral"];
  } catch (error) {
    console.error("Failed to generate tags with Gemini:", error);
    return ["Geral"];
  }
};
