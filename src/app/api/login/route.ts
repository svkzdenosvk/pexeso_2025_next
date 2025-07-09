import { NextResponse } from 'next/server';
import { My_Type_Login } from '@pexeso/_inc/my_types';
import { adminDB } from '@pexeso/lib/firebase/firebase-admin'; // Firebase admin SDK for server-side access to Firestore

//POST req handler
export async function POST(req: Request) {
  try {
    //choose email and password from rewquest
    const { email, password }: My_Type_Login = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'login_page.error_alert.missing_credentials' },
        { status: 400 }
      );
    }

    // call Firebase REST API (no Firebase Admin SDK, because admin SDK doesn´t know how to authenticate be password)
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

    //response from Firebase API
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        // { error: data.error?.message || 'Login failed' },
        { error: 'login_page.error_alert.login_failed' },

        { status: 401 }
      );
    }

    //load user name from Firestore via admin SDK by UID from Firebase
    const userRef = adminDB.collection('users').doc(data.localId);
    const userSnap = await userRef.get();

    const name = userSnap.exists ? (userSnap.data()?.name ?? '') : '';

    // create response
    const response = NextResponse.json({
      user: {
        uid: data.localId,
        email: data.email,
      },
      name,
    });

    // setup cookie with idToken, idToken is for authentication for next requests
    response.cookies.set('token', data.idToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'login_page.error_alert.unknow_err' }, { status: 500 });
  }
}
