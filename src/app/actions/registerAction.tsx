'use server';

import { adminAuth, adminDB } from '@pexeso/lib/firebase/firebase-admin';
import type { My_Type_RegistrationForm } from '@pexeso/_inc/my_types';

/**
 * registerAction
 *
 * Server action handling user registration.
 *
 * Workflow:
 * 1. Validate input (name, email, password)
 * 2. Create user in Firebase Authentication
 * 3. Store user profile in Firestore
 * 4. Rollback Auth user if Firestore write fails
 * 5. Return either { user } on success, or { error } on failure
 *
 * @param {My_Type_RegistrationForm} form - Registration form values
 * @returns {Promise<{ user?: { uid: string; name: string; email: string }; error?: string }>}
 */
export async function registerAction(form: My_Type_RegistrationForm) {
  const { name, email, password } = form;

  // --- Step 1: Input validation
  if (!email || !password || !name) {
    return { error: 'missing_credentials' };
  }

  // Will hold UID for potential rollback
  let userUid: string | null = null;

  try {
    // --- Step 2: Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    userUid = userRecord.uid;

    // --- Step 3: Save user to Firestore
    await adminDB.collection('users').doc(userUid).set({
      name,
      email,
      createdAt: new Date(),
    });

    // --- Step 4: Return user object
    return {
      user: {
        uid: userUid,
        name,
        email,
      },
    };
  } catch (error: any) {
    console.error('❌ Registration error:', error);

    // --- Handle Firebase Auth known error
    if (error.code === 'auth/email-already-exists') {
      return { error: 'email_registered' };
    }

    // --- Rollback Auth user if Firestore failed
    if (userUid) {
      try {
        await adminAuth.deleteUser(userUid);
        console.log('🧹 Rolled back user in Auth after Firestore failure');
      } catch (deleteError) {
        console.error('⚠️ Failed to rollback Auth user:', deleteError);
      }
    }

    return { error: 'req_failed' };
  }
  
}
