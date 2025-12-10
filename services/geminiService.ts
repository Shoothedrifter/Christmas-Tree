import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLuxuryGreeting = async (name: string, theme: string): Promise<string> => {
  try {
    const prompt = `
      Write a short, luxurious, sophisticated, and heartwarming Christmas greeting for "${name}".
      The theme or vibe is "${theme}".
      The tone should be like a 1920s Gatsby party invitation or a royal decree—elegant, poetic, and full of grandeur.
      Keep it under 40 words. Do not use hashtags.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "May your holidays be filled with golden moments and emerald dreams.";
  } catch (error) {
    console.error("Error generating greeting:", error);
    return "Wishing you a season of splendor and majestic joy.";
  }
};