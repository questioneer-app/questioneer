import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
ai.models.listModels().then(res => {
  for (const m of res) {
    console.log(m.name);
  }
}).catch(console.error);
