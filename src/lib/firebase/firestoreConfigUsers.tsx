// Core Firebase import (must-have for all Firebase usage)
import { initializeApp } from "firebase/app";

// Firebase Auth and Firestore services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config using environment variables for security (defined in .env.local or similar)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize the Firebase app instance
const appUsers = initializeApp(firebaseConfig);

// Export Firebase services to use throughout the app
export const auth = getAuth(appUsers);
export const projectUsers = getFirestore(appUsers);
