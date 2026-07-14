import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, UploadCloud, File, X } from "lucide-react";

export default function UploadMaterial({ onNext, onBack }: { onNext: (data: any) => void, onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert("Invalid file type. Please upload a PDF or Image.");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Material</h2>
          <p className="text-gray-500 text-sm">Upload study notes, PDFs, or textbook images.</p>
        </div>
      </div>

      <div className="space-y-6">
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              isDragging ? 'border-sky-500 bg-sky-50' : 'border-gray-300 hover:border-sky-300 hover:bg-sky-50/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-sky-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Click to upload or drag and drop</h3>
            <p className="text-gray-500 text-sm mb-4">PDF, JPG, PNG, WEBP (Max 10MB)</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-2xl p-6 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                <File className="w-6 h-6 text-sky-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => onNext({ file })}
            disabled={!file}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
              file 
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
