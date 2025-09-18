'use server';

import { cookies } from 'next/headers';
import { adminDB } from '@pexeso/lib/firebase/firebase-admin';
import type { My_Type_Login } from '@pexeso/_inc/my_types';

/**
 * Mapping of Firebase error codes to custom i18n-friendly keys.
 * These keys can be used on the frontend for displaying localized error messages.
 */
const firebaseErrorMap: Record<string, string> = {
  INVALID_PASSWORD: 'invalid_credentials',
  INVALID_LOGIN_CREDENTIALS: 'invalid_credentials',
  EMAIL_NOT_FOUND: 'invalid_credentials',
  MISSING_PASSWORD: 'missing_credentials',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'too_many_req',
  USER_DISABLED: 'login_failed',
};

/**
 * loginAction
 *
 * Server action handling user login.
 * Workflow:
 * 1. Validate input (email, password)
 * 2. Authenticate via Firebase Auth REST API
 * 3. Map Firebase errors → internal error codes
 * 4. Fetch additional user profile info (name) from Firestore
 * 5. Store JWT token in secure HttpOnly cookie
 * 6. Return user object to client
 *
 * @param {My_Type_Login} param0 - user login credentials
 * @returns {Promise<{ user: object } | { error: string }>}
 */
export async function loginAction({ email, password }: My_Type_Login) {
  try {
    // --- Step 1: Input validation
    if (!email || !password) {
      return { error: 'missing_credentials' };
    }

    // --- Step 2: Call Firebase Auth REST API
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await res.json();

    // --- Step 3: Handle Firebase error response
    if (!res.ok) {
      // console.warn('Firebase login error:', data);
      const firebaseError = data.error?.message ?? 'unknown_err';
      const mappedError = firebaseErrorMap[firebaseError] ?? 'login_failed';
      return { error: mappedError };
    }

    // --- Step 4: Fetch user profile (optional: name) from Firestore
    const userRef = adminDB.collection('users').doc(data.localId);
    const userSnap = await userRef.get();
    const name = userSnap.exists ? (userSnap.data()?.name ?? '') : '';

    // --- Step 5: Set secure HttpOnly cookie with Firebase token
    const cookieStore = await cookies();
    cookieStore.set('token', data.idToken, {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    });

    // --- Step 6: Return normalized user object
    return {
      user: {
        uid: data.localId,
        name: name,
        email: data.email,
      },
    };
  } catch (err: any) {

    // --- Step 7: Handle unexpected runtime errors
    console.error('Login error:', err);
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return { error: 'net_req_failed' };  // Network error
    }
    return { error: 'unknown_err' }; // Generic fallback
  }
}
