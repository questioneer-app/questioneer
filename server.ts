import "dotenv/config";
import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { generatePaperHTML } from "./src/lib/htmlTemplate";

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
      const { schoolName, difficulty, questionTypes, marks, numQuestions, topicMode, selectedTopics, examinationType, academicSession, timeAllowed } = parsedOptions || {};

      let parts = [];
      let systemPrompt = `You are an expert educational content creator and question paper generator. Your task is to generate high-quality question papers strictly based on the provided material or syllabus chapters. Follow the instructions to create exactly the types of questions requested with appropriate difficulty.

You MUST respond ONLY with a valid JSON object matching the exact structure below. Do not include markdown formatting like \`\`\`json or any conversational text.

{
  "examinationName": "ANNUAL EXAMINATION 2025-26",
  "className": "Class X",
  "subject": "Science",
  "time": "3 Hours",
  "maximumMarks": "80",
  "sections": [
    {
      "title": "SECTION A",
      "description": "(MULTIPLE CHOICE QUESTIONS)",
      "questions": [
        {
          "number": 1,
          "text": "Which of the following is... (use string with \\n for line breaks)",
          "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
          "marks": 1
        }
      ]
    }
  ]
}

Rules for JSON generation:
- "options" should be an empty array if the question is not multiple choice.
- "number" should be sequential across the whole paper (1, 2, 3... not restarting per section).
- "marks" is a number.
- "text" should contain the question body.
- "title" must be in the format "SECTION A", "SECTION B", etc.
- "description" should describe the question type, e.g., "(SHORT ANSWER QUESTIONS)".
- DO NOT INCLUDE ANY OTHER TEXT IN YOUR RESPONSE EXCEPT THE JSON.`;
      
      let prompt = `Create a question paper based on the following requirements:\n`;
      if (schoolName) prompt += `- School Name: ${schoolName}\n`;
      if (difficulty) prompt += `- Difficulty: ${difficulty}\n`;
      if (questionTypes && questionTypes.length > 0) prompt += `- Question Types: ${questionTypes.join(', ')}\n`;
      if (marks) prompt += `- Total Marks: ${marks}\n`;
      if (numQuestions) prompt += `- Number of Questions: ${numQuestions}\n`;

      if (req.file || topicMode === 'detect' || topicMode === 'generate') {
        if (!req.file) {
          return res.status(400).json({ error: "File upload is required for this method" });
        }
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
        if (!content) {
           return res.status(400).json({ error: "Content (className, subject, chapters) is required" });
        }
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        prompt += `- Class: ${parsedContent?.className}\n`;
        prompt += `- Subject: ${parsedContent?.subject}\n`;
        prompt += `- Chapters: ${parsedContent?.chapters?.join(', ')}\n`;
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

      if (topicMode === 'detect') {
         res.json({ result: response.text });
         return;
      }

      let parsedResult: any;
      try {
        const cleanedText = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
        parsedResult = JSON.parse(cleanedText);
      } catch (err) {
        console.error("Failed to parse Gemini output as JSON", response.text);
        return res.status(500).json({ error: "Failed to generate valid paper format. Please try again." });
      }
      
      const parsedContent = content ? (typeof content === 'string' ? JSON.parse(content) : content) : null;
      parsedResult.schoolName = schoolName ? schoolName.toUpperCase() : 'SCHOOL NAME';
      parsedResult.examinationName = examinationType ? examinationType.toUpperCase() : (parsedResult.examinationName || 'ANNUAL EXAMINATION');
      parsedResult.academicSession = academicSession || '';
      parsedResult.time = timeAllowed || parsedResult.time || '';
      parsedResult.maximumMarks = marks || parsedResult.maximumMarks || '';
      
      if (parsedContent?.className) parsedResult.className = parsedContent.className;
      if (parsedContent?.subject) parsedResult.subject = parsedContent.subject;
      
      const htmlResult = generatePaperHTML(parsedResult);
      res.json({ result: htmlResult });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred" });
    }
  });

  // Catch-all for API routes to prevent HTML fallbacks
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
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
