import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINIAI_API_KEY });

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const prompt = `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: SUMMARY_SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    if (!result || !result.text) {
      throw new Error("Empty response from Gemini API");
    }

    return result.text;
  } catch (error: any) {
    console.error("GEMINI API error:", error);
    throw error;
  }
};
