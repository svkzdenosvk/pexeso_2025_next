// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { adminAuth, adminDB } from '@pexeso/lib/firebase/firebase-admin';
import { verifyApiOrigin } from '@pexeso/_inc/data';

/**
 * Handles user registration via POST API.
 *
 * Workflow:
 * 1. Verifies request origin
 * 2. Parses and validates input data (name, email, password)
 * 3. Registers user in Firebase Authentication
 * 4. Stores user in Firestore under `users` collection
 * 5. Handles rollback if Firestore write fails
 *
 * @method POST
 * @returns JSON response with success or error
 */

//POST API req. handler to register new user
export async function POST(req: Request) {
  // ---------- 1. Verify origin of the request (basic API protection)
  const origin = req.headers.get('origin');

  if (!verifyApiOrigin(origin)) {
    return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  }

  // ---------- 2. Parse body and validate required fields

  //expected name, email, password from JSON request
  const { name, email, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'missing_credentials' }, { status: 400 });
  }

  // Will hold user UID in case rollback is needed
  let userUid: string | null = null;

  try {
    // ---------- 3. Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    //Save UID of user to delete him from Authetication, if occurs problem with saving him in Firestore
    userUid = userRecord.uid;

    // ---------- 4. Save new user to Firestore (users collection)

    await adminDB.collection('users').doc(userUid).set({
      name,
      email,
      createdAt: new Date(),
    });

    // ---------- 5. Successful registration
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error during registration:', error);

    // ---------- Handle known Firebase Auth error (email already exists)
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'email_registered' }, { status: 400 });
    }

    // User saved in Authentication, but failed in saving to Firestore, so deleting him from Authentication
    if (userUid) {
      try {
        await adminAuth.deleteUser(userUid);
        console.log('🧹 User deleted from Auth after Firestore failure');
      } catch (deleteError) {
        console.error('⚠️ Failed to rollback Auth user:', deleteError);
      }
    }

    // Error during registration
    return NextResponse.json({ error: 'req_failed' }, { status: 500 });
  }
}
