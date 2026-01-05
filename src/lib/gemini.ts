import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AppStatus } from "@/types";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const emailClassificationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    status: {
      type: SchemaType.STRING,
      enum: ["Interview", "Applied", "Rejected", "Offer"],
      description:
        "The current status of the job application based on the email content.",
    },
    urgency: {
      type: SchemaType.STRING,
      enum: ["High", "Medium", "Low"],
      description: "How urgent is the action required by the candidate.",
    },
  },
  required: ["status", "urgency"],
};

export const classifyEmailContent = async (
  subject: string,
  snippet: string
): Promise<{ status: AppStatus; urgency: string } | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key not found. Returning mock fallback.");
    return { status: "Applied", urgency: "Low" };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: emailClassificationSchema,
      },
      systemInstruction:
        "You are an expert recruiter assistant. Classify emails into statuses accurately.",
    });

    const prompt = `
      Analyze the following email metadata and classify the job application status.
      Subject: ${subject}
      Snippet: ${snippet}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    if (!jsonText) return null;

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to classify email with Gemini:", error);
    return null;
  }
};
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
  content: string
): Promise<string[]> => {
  if (!apiKey) {
    console.warn("Gemini API Key not found. Returning fallback tags.");
    return ["Geral"];
  }

  try {
    // Usando gemini-1.5-flash-001 que é a versão estável atual
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
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
