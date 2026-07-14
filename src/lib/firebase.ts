import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0821366857",
  appId: "1:586856583123:web:1f2b9d5528dd58f23fe926",
  apiKey: "AIzaSyCWuhRKsCFrZXygiwfVe-Wsh8R7d5wKGjY",
  authDomain: "gen-lang-client-0821366857.firebaseapp.com",
  storageBucket: "gen-lang-client-0821366857.firebasestorage.app",
  messagingSenderId: "586856583123",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-a2abecc4-4b29-4629-bbe9-a3e0e68a7a56");
