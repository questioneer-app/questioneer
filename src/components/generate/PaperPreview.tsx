import { Download, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
// @ts-ignore
import html2pdf from "html2pdf.js";

export default function PaperPreview({ markdown, onReset }: { markdown: string, onReset: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!contentRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const element = contentRef.current;
      const opt = {
        margin:       15,
        filename:     'Question_Paper.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Generated Paper</h2>
          <p className="text-gray-500 text-sm">Review your generated question paper.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onReset}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-200 rounded-full hover:bg-primary-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Create New
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>
      
      <div className="p-8 md:p-12" ref={contentRef}>
        <div className="prose prose-gray max-w-none">
          <div className="markdown-body font-sans text-gray-800 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
