import { Link } from "react-router-dom";
import { BookOpenText, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpenText className="w-7 h-7 text-sky-500" />
          <span className="font-bold text-xl tracking-tight text-gray-900">QUESTIONEER</span>
        </Link>
        <nav className="hidden md:flex space-x-8 items-center">
          <Link to="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors">How it Works</Link>
          <Link to="/#features" className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors">Features</Link>
          <Link to="/history" className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors">History</Link>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                {user.displayName?.split(' ')[0]}
              </span>
              <button 
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button 
              onClick={handleSignIn}
              className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors flex items-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
          )}

          <Link 
            to="/generate" 
            className="text-sm font-medium bg-sky-500 text-white px-5 py-2 rounded-full hover:bg-sky-600 transition-colors ml-4"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
