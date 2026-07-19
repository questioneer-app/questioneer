import { useState } from "react";
import ChapterSelection from "../components/generate/ChapterSelection";
import UploadMaterial from "../components/generate/UploadMaterial";
import PaperConfig from "../components/generate/PaperConfig";
import PaperPreview from "../components/generate/PaperPreview";
import { BookOpen, FileUp } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import GenerationLoader from "../components/generate/GenerationLoader";

export type GenerationMethod = "chapters" | "upload" | null;

export default function Generate() {
  const [method, setMethod] = useState<GenerationMethod>(null);
  const [step, setStep] = useState<number>(1);
  const [paperData, setPaperData] = useState<any>(null);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);

  const handleNext = (data: any) => {
    setPaperData((prev: any) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const handleGenerate = async (configData: any) => {
    try {
      setStep(4); // Loading state
      const finalData = { ...paperData, ...configData };
      
      const formData = new FormData();
      if (finalData.method === 'upload' && finalData.file) {
        formData.append("file", finalData.file);
        formData.append("options", JSON.stringify({
          schoolName: finalData.schoolName,
          examinationType: finalData.examinationType,
          academicSession: finalData.academicSession,
          timeAllowed: finalData.timeAllowed,
          difficulty: finalData.difficulty,
          questionTypes: finalData.questionTypes,
          marks: finalData.marks,
          numQuestions: finalData.numQuestions,
          topicMode: 'generate',
          selectedTopics: finalData.selectedTopics || []
        }));
      } else {
        formData.append("content", JSON.stringify({
          className: finalData.className,
          subject: finalData.subject,
          chapters: finalData.chapters
        }));
        formData.append("options", JSON.stringify({
          schoolName: finalData.schoolName,
          examinationType: finalData.examinationType,
          academicSession: finalData.academicSession,
          timeAllowed: finalData.timeAllowed,
          difficulty: finalData.difficulty,
          questionTypes: finalData.questionTypes,
          marks: finalData.marks,
          numQuestions: finalData.numQuestions,
        }));
      }

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        body: formData,
      });
      
      let resultText = await res.text();
      if (!res.ok) {
        throw new Error(`Generation failed: ${res.status} ${resultText}`);
      }
      
      if (resultText.trim().startsWith('<')) {
        throw new Error("The server is still starting up or returned an unexpected page. Please wait a few seconds and try again.");
      }
      
      let result;
      try {
        const parsed = JSON.parse(resultText);
        if (parsed.error) {
          throw new Error(parsed.error);
        }
        result = parsed.result;
      } catch (e: any) {
        if (e.message.includes('server is still starting up') || e.message.includes('API Key missing')) {
          throw e;
        }
        throw new Error(`Failed to parse response: ${resultText.substring(0, 100)}...`);
      }
      
      setGeneratedMarkdown(result);
      setStep(5); // Result state

      // Save to Firebase if user is logged in
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, "papers"), {
            userId: auth.currentUser.uid,
            method: finalData.method,
            subject: finalData.subject || null,
            className: finalData.className || null,
            marks: finalData.marks,
            numQuestions: finalData.numQuestions,
            markdown: result,
            createdAt: new Date().toISOString()
          });
        } catch (dbError) {
          console.error("Failed to save paper to history:", dbError);
          // UI does not crash, user can still see the generated paper.
        }
      }

    } catch (err) {
      console.error(err);
      alert("Error generating paper");
      setStep(3); // Go back to config
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Choose Generation Method</h2>
            <p className="text-gray-500">Select how you want to create your question paper.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => { setMethod("chapters"); setStep(2); }}
              className="p-8 border-2 border-gray-100 hover:border-primary-600 rounded-3xl transition-all flex flex-col items-center text-center group bg-white shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-700 transition-colors">
                <BookOpen className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-700 transition-colors">Select Chapters</h3>
              <p className="text-gray-500 text-sm">Choose specific subjects and chapters from NCERT syllabus.</p>
            </button>

            <button
              onClick={() => { setMethod("upload"); setStep(2); }}
              className="p-8 border-2 border-gray-100 hover:border-primary-600 rounded-3xl transition-all flex flex-col items-center text-center group bg-white shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-700 transition-colors">
                <FileUp className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-700 transition-colors">Upload Material</h3>
              <p className="text-gray-500 text-sm">Upload PDFs or images of notes to generate targeted questions.</p>
            </button>
          </div>
        </div>
      )}

      {step === 2 && method === "chapters" && (
        <ChapterSelection onNext={(data) => handleNext({ method: "chapters", ...data })} onBack={() => setStep(1)} />
      )}

      {step === 2 && method === "upload" && (
        <UploadMaterial onNext={(data) => handleNext({ method: "upload", ...data })} onBack={() => setStep(1)} />
      )}

      {step === 3 && (
        <PaperConfig 
          onGenerate={handleGenerate} 
          onBack={() => setStep(2)} 
        />
      )}

      {step === 4 && <GenerationLoader />}

      {step === 5 && generatedMarkdown && (
        <PaperPreview markdown={generatedMarkdown} onReset={() => setStep(1)} />
      )}
    </div>
  );
}
