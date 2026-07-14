import "dotenv/config";
import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // API Routes
  app.post("/api/generate", upload.single("file"), async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key missing" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { type, content, options } = req.body;
      
      const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
      const { difficulty, questionTypes, marks, numQuestions, topicMode, selectedTopics } = parsedOptions || {};

      let parts = [];
      let systemPrompt = `You are an expert educational content creator and question paper generator. Your task is to generate high-quality question papers strictly based on the provided material or syllabus chapters. Follow the instructions to create exactly the types of questions requested with appropriate difficulty. Output the question paper clearly with titles, sections, and proper numbering. Output valid Markdown.`;
      
      let prompt = `Create a question paper based on the following requirements:\n`;
      if (difficulty) prompt += `- Difficulty: ${difficulty}\n`;
      if (questionTypes && questionTypes.length > 0) prompt += `- Question Types: ${questionTypes.join(', ')}\n`;
      if (marks) prompt += `- Total Marks: ${marks}\n`;
      if (numQuestions) prompt += `- Number of Questions: ${numQuestions}\n`;

      if (req.file) {
        if (topicMode === 'detect') {
          prompt = `Analyze the attached file and detect the main topics covered. Respond with a JSON array of strings containing the topic names. Output only the JSON. Example: ["Photosynthesis", "Respiration"]`;
        } else if (topicMode === 'generate') {
           if (selectedTopics && selectedTopics.length > 0) {
              prompt += `- Selected Topics to cover: ${selectedTopics.join(', ')}\n`;
           }
           prompt += `\nUse the attached file as the primary source material for the questions.\n`;
        }
        
        parts.push({
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString("base64"),
          }
        });
      } else {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        prompt += `- Class: ${parsedContent.className}\n`;
        prompt += `- Subject: ${parsedContent.subject}\n`;
        prompt += `- Chapters: ${parsedContent.chapters.join(', ')}\n`;
        prompt += `\nBase the questions on NCERT syllabus for these chapters.\n`;
      }

      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: parts,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
