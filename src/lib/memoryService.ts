import { GoogleGenAI } from "@google/genai";
import { models } from "./gemini";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractLearnings(chatHistory: { role: string; content: string }[]): Promise<{
  learned: boolean;
  title?: string;
  content?: string;
  tags?: string[];
}> {
  const prompt = `
You are an Agent Memory Extractor. 
Analyze the following chat history between a user and an AI model.
Determine if the AI successfully completed a complex task, learned something new, encountered a failure and learned how to fix it, or acquired a new piece of knowledge/skill that should be explicitly saved for future use.

If there is a valuable skill to extract, output a JSON object containing:
- "learned": true
- "title": A concise title for the skill (max 50 chars).
- "content": A detailed Markdown document describing the skill. Include context, steps, and examples if applicable. DO NOT use markdown code blocks to wrap the JSON output itself.
- "tags": An array of string tags (1-3 tags).

If there is nothing significant to learn, output:
{ "learned": false }

Chat History:
${chatHistory.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: models.flash,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Failed to extract learnings from chat", error);
  }
  
  return { learned: false };
}
