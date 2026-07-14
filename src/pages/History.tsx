import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { DocumentData } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FileText, Clock, ArrowRight } from "lucide-react";
import { collection as firestoreCollection, query as firestoreQuery, where as firestoreWhere, orderBy as firestoreOrderBy, getDocs as firestoreGetDocs } from "firebase/firestore";

export default function History() {
  const [papers, setPapers] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        fetchHistory(u.uid);
      } else {
        setPapers([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid: string) => {
    try {
      const q = firestoreQuery(
        firestoreCollection(db, "papers"),
        firestoreWhere("userId", "==", uid),
        firestoreOrderBy("createdAt", "desc")
      );
      const snapshot = await firestoreGetDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPapers(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view history</h2>
        <p className="text-gray-500 mb-8 max-w-sm">You need to sign in to save and view your previously generated question papers.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Your Generated Papers</h1>
        <p className="text-gray-500 mt-2">Access and review all your previously generated question papers.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No papers generated yet</h3>
          <p className="text-gray-500 mb-6">Create your first question paper to see it here.</p>
          <Link 
            to="/generate"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-colors shadow-sm"
          >
            Generate Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper: any) => (
            <div key={paper.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                  {new Date(paper.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {paper.subject || "Custom Upload"} - {paper.className || "Mixed"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {paper.marks} Marks • {paper.numQuestions} Questions
              </p>
              <div className="pt-4 border-t border-gray-100">
                <Link to={`/history/${paper.id}`} className="text-sm font-medium text-gray-900 group-hover:text-primary-700 flex items-center transition-colors">
                  View Paper <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
