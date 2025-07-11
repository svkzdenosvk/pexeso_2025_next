// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { adminAuth, adminDB } from '@pexeso/lib/firebase/firebase-admin';

// list of allowed origins (pages from POST req came)
const allowedOrigins = [
  'http://localhost:3000',
  'https://pexeso-next.netlify.app',
];

//POST API req. handler to register new user
export async function POST(req: Request) {
  const origin = req.headers.get('origin');

  // verification of the origin od request (protection against external POST requests)
  if (!origin || !allowedOrigins.includes(origin)) {
    console.error('Domain not allowed:');

    return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  }

  //expected name, email, password from JSON request
  const { name, email, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'missing_credentials' }, { status: 400 });
  }

  let userUid: string | null = null;

  try {
    // creating user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    //save UID of user to delete him from Authetication, if occurs problem with saving him in Firestore
    userUid = userRecord.uid;

    // save user to Forestore
    await adminDB.collection('users').doc(userUid).set({
      name,
      email,
      createdAt: new Date(),
    });

    // successful registration
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error during registration:', error);

    // 🛑 If email already exists, return specific error
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'email_registered' }, { status: 400 });
    }

    // user saved in Authentication, but failed in saving to Firestore, so deleting from Authentication
    if (userUid) {
      try {
        await adminAuth.deleteUser(userUid);
        console.log('🧹 User deleted from Auth after Firestore failure');
      } catch (deleteError) {
        console.error('⚠️ Failed to rollback Auth user:', deleteError);
      }
    }

    //error during registration
    return NextResponse.json({ error: 'req_failed' }, { status: 500 });
  }
}
