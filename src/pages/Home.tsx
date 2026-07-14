import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileUp, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
          NCERT-Based AI <br className="hidden md:block" />
          Question Paper Generator
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-12">
          Instantly generate high-quality, exam-oriented question papers from NCERT syllabus chapters or your own uploaded study materials.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            to="/generate"
            className="flex items-center px-8 py-4 bg-primary-600 text-white rounded-full font-medium text-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            Generate Question Paper
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Select Syllabus</h3>
              <p className="text-gray-600">Choose from Class 1 to 12 NCERT subjects and intuitively pick specific chapters to focus on.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <FileUp className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Materials</h3>
              <p className="text-gray-600">Upload notes, textbooks, or PDFs. Our AI detects topics to generate targeted questions.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Generation</h3>
              <p className="text-gray-600">Configure difficulty, question types, and marks to produce a beautifully formatted exam paper.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
