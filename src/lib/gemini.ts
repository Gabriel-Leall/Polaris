import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AppStatus } from "@/types";

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const emailClassificationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    status: {
      type: SchemaType.STRING,
      enum: ['Interview', 'Applied', 'Rejected', 'Offer'],
      description: "The current status of the job application based on the email content."
    },
    urgency: {
      type: SchemaType.STRING,
      enum: ['High', 'Medium', 'Low'],
      description: "How urgent is the action required by the candidate."
    }
  },
  required: ['status', 'urgency']
};

export const classifyEmailContent = async (
  subject: string, 
  snippet: string
): Promise<{ status: AppStatus, urgency: string } | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key not found. Returning mock fallback.");
    return { status: 'Applied', urgency: 'Low' };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: emailClassificationSchema,
      },
      systemInstruction: "You are an expert recruiter assistant. Classify emails into statuses accurately."
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