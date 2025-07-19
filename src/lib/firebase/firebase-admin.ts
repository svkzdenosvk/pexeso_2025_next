// lib/firebase-admin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.GOOGLE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fix pre Netlify

    // privateKey: process.env.GOOGLE_PRIVATE_KEY,
  }),
};

const adminApp = !getApps().length
  ? initializeApp(firebaseAdminConfig)
  : getApp();

export const adminAuth = getAuth(adminApp);
export const adminDB = getFirestore(adminApp);
