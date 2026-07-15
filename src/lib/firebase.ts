import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | undefined;
let authObj: any;
let dbObj: any;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  authObj = getAuth(app);
  dbObj = getFirestore(app, "ai-studio-a2abecc4-4b29-4629-bbe9-a3e0e68a7a56");
} else {
  console.warn("Firebase is not configured. Authentication and database features will be disabled.");
  authObj = {
    onAuthStateChanged: (cb: any) => {
      cb(null);
      return () => {};
    },
    currentUser: null,
    signOut: async () => {},
  };
  dbObj = {} as any;
}

export const auth = authObj as Auth;
export const db = dbObj as Firestore;
