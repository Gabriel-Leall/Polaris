import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppStatus } from "../types";

// This service demonstrates how we would realistically process real emails using Gemini 1.5 Flash.
// In this mock demo, the UI uses constants.ts, but this logic is ready for integration.

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is handled securely
const ai = new GoogleGenAI({ apiKey });

const emailClassificationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: ['Interview', 'Applied', 'Rejected', 'Offer'],
      description: "The current status of the job application based on the email content."
    },
    urgency: {
      type: Type.STRING,
      enum: ['High', 'Medium', 'Low'],
      description: "How urgent is the action required by the candidate."
    }
  },
  required: ['status', 'urgency']
};

export const classifyEmailContent = async (subject: string, snippet: string): Promise<{ status: AppStatus, urgency: string } | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key not found. Returning mock fallback.");
    return { status: 'Applied', urgency: 'Low' };
  }

  try {
    const prompt = `
      Analyze the following email metadata and classify the job application status.
      Subject: ${subject}
      Snippet: ${snippet}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: emailClassificationSchema,
        systemInstruction: "You are an expert recruiter assistant. Classify emails into statuses accurately."
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to classify email with Gemini:", error);
    return null;
  }
};
