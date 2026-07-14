import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SUBJECTS = ["Mathematics", "Science", "Social Science", "English", "Hindi"];
const DUMMY_CHAPTERS: Record<string, string[]> = {
  Science: ["Chemical Reactions", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Life Processes", "Control and Coordination", "Reproduction"],
  Mathematics: ["Real Numbers", "Polynomials", "Linear Equations", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry"],
  Default: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"]
};

export default function ChapterSelection({ onNext, onBack }: { onNext: (data: any) => void, onBack: () => void }) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  const chapters = selectedSubject 
    ? (DUMMY_CHAPTERS[selectedSubject] || DUMMY_CHAPTERS["Default"])
    : [];

  const handleChapterToggle = (chapter: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter]
    );
  };

  const handleSelectAll = () => {
    if (selectedChapters.length === chapters.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters([...chapters]);
    }
  };

  const isFormValid = selectedClass && selectedSubject && selectedChapters.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select Syllabus</h2>
          <p className="text-gray-500 text-sm">Choose the class, subject, and specific chapters.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Class</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => { setSelectedClass(cls); setSelectedChapters([]); }}
                className={`py-2 px-3 text-sm rounded-xl border transition-all ${
                  selectedClass === cls 
                    ? 'border-sky-500 bg-sky-500 text-white' 
                    : 'border-gray-200 text-gray-700 hover:border-sky-300 bg-white'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selection */}
        {selectedClass && (
          <div className="animate-in fade-in duration-300">
            <label className="block text-sm font-medium text-gray-900 mb-3">Subject</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => { setSelectedSubject(sub); setSelectedChapters([]); }}
                  className={`py-2 px-4 text-sm rounded-xl border transition-all ${
                    selectedSubject === sub 
                      ? 'border-sky-500 bg-sky-500 text-white' 
                      : 'border-gray-200 text-gray-700 hover:border-sky-300 bg-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Selection */}
        {selectedSubject && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-900">Chapters</label>
              <button 
                onClick={handleSelectAll}
                className="text-sm font-medium text-sky-500 hover:text-sky-600"
              >
                {selectedChapters.length === chapters.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {chapters.map((chapter) => (
                <label 
                  key={chapter} 
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedChapters.includes(chapter) 
                      ? 'border-sky-500 bg-sky-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    checked={selectedChapters.includes(chapter)}
                    onChange={() => handleChapterToggle(chapter)}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{chapter}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => onNext({ className: selectedClass, subject: selectedSubject, chapters: selectedChapters })}
            disabled={!isFormValid}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
              isFormValid 
                ? 'bg-sky-500 text-white hover:bg-sky-600' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next Step
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
