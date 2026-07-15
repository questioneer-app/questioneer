import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import config from "../../firebase-applet-config.json";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || config.projectId || "gen-lang-client-0821366857",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId || "1:586856583123:web:1f2b9d5528dd58f23fe926",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || config.apiKey || "AIzaSyCWuhRKsCFrZXygiwfVe-Wsh8R7d5wKGjY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain || "gen-lang-client-0821366857.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket || "gen-lang-client-0821366857.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId || "586856583123",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-a2abecc4-4b29-4629-bbe9-a3e0e68a7a56");
