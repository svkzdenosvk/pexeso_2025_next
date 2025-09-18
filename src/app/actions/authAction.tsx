'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '@pexeso/lib/firebase/firebase-admin';

/**
 * authAction
 *
 * Server action that validates the current user session.
 *
 * Workflow:
 * 1. Read authentication token from cookies
 * 2. Verify token using Firebase Admin SDK
 * 3. Retrieve user profile from Firebase by UID
 * 4. Return either `{ isLoggedIn: true, uid, email, name }` on success
 *    or `{ isLoggedIn: false }` if not authenticated / verification fails
 *
 * @returns {Promise<{ isLoggedIn: boolean; uid?: string; email?: string; name?: string }>}
 */
export async function authAction() {
  // --- Step 1: Read cookies and extract token
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // if token not exists -> user is not logged in
  if (!token) {
    return { isLoggedIn: false };
  }

  try {
    // --- Step 2: Verify token with Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);

    // --- Step 3: Load user profile by UID
    const user = await adminAuth.getUser(decoded.uid);

    // --- Step 4: Return login status and user details
    return {
      isLoggedIn: true,
      uid: user.uid,
      email: user.email,
      name: user.displayName,
    };
  } catch (err) {

    // --- Step 5: Token verification failed (expired, invalid, revoked, etc.)
    // console.error('Auth check error:', err);
    return { isLoggedIn: false };
  }
}
