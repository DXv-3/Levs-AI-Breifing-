import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  lite: "gemini-3.1-flash-lite-preview",
};

export async function generateAnalysis(prompt: string, content: string) {
  const response = await ai.models.generateContent({
    model: models.pro,
    contents: [
      { text: `Context: ${content}` },
      { text: prompt }
    ],
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });
  return response.text;
}

export async function chatWithGemini(history: { role: "user" | "model", parts: { text: string }[] }[], message: string) {
  const chat = ai.chats.create({
    model: models.flash,
    history: history,
  });
  
  const response = await chat.sendMessage({
    message: message,
  });
  
  return response.text;
}

export async function quickResponse(prompt: string) {
  const response = await ai.models.generateContent({
    model: models.lite,
    contents: prompt,
  });
  return response.text;
}
