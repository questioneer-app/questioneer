import { Download, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsPDF } from "jspdf";

export default function PaperPreview({ markdown, onReset }: { markdown: string, onReset: () => void }) {
  
  const handleDownloadPDF = () => {
    // Basic jsPDF setup for exporting text
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Split markdown into lines and add to PDF
    const lines = doc.splitTextToSize(markdown, pageWidth - margin * 2);
    
    let cursorY = margin;
    lines.forEach((line: string) => {
      if (cursorY > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += 7;
    });

    doc.save("Question_Paper.pdf");
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
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>
      
      <div className="p-8 md:p-12 prose prose-gray max-w-none">
        <div className="markdown-body font-sans text-gray-800 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
