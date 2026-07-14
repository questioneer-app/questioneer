import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import PaperPreview from "../components/generate/PaperPreview";
import { ArrowLeft } from "lucide-react";

export default function PaperDetail() {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "papers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaper(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        console.error("Error fetching paper:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex-1 flex flex-col items-center py-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Paper not found</h2>
        <Link to="/history" className="text-sky-500 hover:underline">Return to History</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/history" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-sky-500 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to History
      </Link>
      
      <PaperPreview markdown={paper.markdown} onReset={() => window.location.href = '/generate'} />
    </div>
  );
}
