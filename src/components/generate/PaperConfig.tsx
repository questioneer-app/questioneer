import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function PaperConfig({ onGenerate, onBack }: { onGenerate: (data: any) => void, onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [marks, setMarks] = useState<number>(50);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [examType, setExamType] = useState<string>("Annual Examination");
  const [customExamType, setCustomExamType] = useState<string>("");
  const [academicSession, setAcademicSession] = useState<string>("2025-26");
  const [timeAllowed, setTimeAllowed] = useState<string>("3 Hours");

  const types = ["MCQ", "Fill in the blanks", "True/False", "Short Answer", "Long Answer", "Mixed"];

  const handleTypeToggle = (type: string) => {
    if (type === "Mixed") {
      setSelectedTypes(["Mixed"]);
      return;
    }
    
    setSelectedTypes(prev => {
      let newTypes = prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
      newTypes = newTypes.filter(t => t !== "Mixed");
      return newTypes;
    });
  };

  const isFormValid = selectedTypes.length > 0 && marks > 0 && numQuestions > 0 && academicSession.trim().length > 0 && timeAllowed.trim().length > 0 && (examType !== 'Custom' || customExamType.trim().length > 0);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configure Paper</h2>
          <p className="text-gray-500 text-sm">Set the difficulty, question types, and structure.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Difficulty Level</label>
          <div className="grid grid-cols-4 gap-3">
            {["Easy", "Medium", "Hard", "Mixed"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all ${
                  difficulty === diff 
                    ? 'border-primary-600 bg-primary-600 text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-primary-300 bg-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Question Types</label>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`py-2 px-4 text-sm rounded-xl border transition-all ${
                  selectedTypes.includes(type) 
                    ? 'border-primary-600 bg-primary-50 text-primary-600' 
                    : 'border-gray-200 text-gray-700 hover:border-primary-300 bg-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Exam Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Examination Type <span className="text-red-500">*</span></label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 outline-none focus:ring-1 focus:ring-primary-600 transition-colors bg-white"
            >
              <option value="Unit Test">Unit Test</option>
              <option value="Class Test">Class Test</option>
              <option value="Monthly Test">Monthly Test</option>
              <option value="Quarterly Examination">Quarterly Examination</option>
              <option value="Half-Yearly Examination">Half-Yearly Examination</option>
              <option value="Annual Examination">Annual Examination</option>
              <option value="Pre-Board Examination">Pre-Board Examination</option>
              <option value="Board Examination">Board Examination</option>
              <option value="Custom">Custom</option>
            </select>
            {examType === 'Custom' && (
              <input
                type="text"
                value={customExamType}
                onChange={(e) => setCustomExamType(e.target.value)}
                placeholder="Enter custom examination name"
                className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 outline-none focus:ring-1 focus:ring-primary-600 transition-colors"
              />
            )}
          </div>
          {/* Academic Session */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Academic Session <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={academicSession}
              onChange={(e) => setAcademicSession(e.target.value)}
              placeholder="e.g. 2025-26"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 outline-none focus:ring-1 focus:ring-primary-600 transition-colors"
            />
          </div>
          {/* Time Allowed */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Time Allowed <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={timeAllowed}
              onChange={(e) => setTimeAllowed(e.target.value)}
              placeholder="e.g. 3 Hours"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 outline-none focus:ring-1 focus:ring-primary-600 transition-colors"
              list="time-options"
            />
            <datalist id="time-options">
              <option value="30 Minutes" />
              <option value="1 Hour" />
              <option value="1 Hour 30 Minutes" />
              <option value="2 Hours" />
              <option value="3 Hours" />
            </datalist>
          </div>
          {/* Marks */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Total Marks <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              value={marks} 
              onChange={(e) => setMarks(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 outline-none focus:ring-1 focus:ring-primary-600 transition-colors"
              min={1}
            />
          </div>
          {/* Num Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Number of Questions <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              value={numQuestions} 
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 outline-none focus:ring-1 focus:ring-primary-600 transition-colors"
              min={1}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => onGenerate({ 
              difficulty, 
              questionTypes: selectedTypes, 
              marks, 
              numQuestions,
              examinationType: examType === 'Custom' ? customExamType : examType,
              academicSession,
              timeAllowed
            })}
            disabled={!isFormValid}
            className={`flex items-center px-8 py-4 rounded-full font-medium transition-all shadow-sm ${
              isFormValid 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-white text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="mr-2 w-5 h-5" />
            Generate Paper
          </button>
        </div>
      </div>
    </div>
  );
}
