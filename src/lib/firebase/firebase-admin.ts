// lib/firebase-admin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK Initialization (Server-Side Only)
 *
 * This file handles the server-side initialization of the Firebase Admin SDK.
 * It is typically used in API routes or server-side rendering (SSR) where full
 * access to Firebase services like Auth and Firestore is required (without client restrictions).
 *
 * - Uses `cert` with environment variables for authentication.
 * - Applies a fix for Netlify deployment where private keys may contain escaped `\n`.
 * - Prevents duplicate initialization using `getApps()` check.
 */

// Firebase Admin SDK configuration using environment variables
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.GOOGLE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fix for Netlify
  }),
};

// Initialize the Admin App only once to avoid errors during hot-reload in development
const adminApp = !getApps().length
  ? initializeApp(firebaseAdminConfig)
  : getApp();

// Export Auth and Firestore instances for use in the server-side code
export const adminAuth = getAuth(adminApp);
export const adminDB = getFirestore(adminApp);
