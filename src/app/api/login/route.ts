import { NextResponse } from 'next/server';
import { My_Type_Login } from '@pexeso/_inc/my_types';
import { adminDB } from '@pexeso/lib/firebase/firebase-admin'; // admin.firestore() setup
// import { doc, getDoc } from 'firebase-admin/firestore'; // NIE client SDK

export async function POST(req: Request) {
  try {
    const { email, password }: My_Type_Login = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Login cez REST API (Firebase Admin to nevie)
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

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'Login failed' }, { status: 401 });
    }

    // Získaj meno používateľa z Firestore cez admin SDK
    const userRef = adminDB.collection('users').doc(data.localId); // alebo 'projectUsers' ak používaš iný názov
    const userSnap = await userRef.get();

    const name = userSnap.exists ? userSnap.data()?.name ?? '' : '';

    // Nastav cookie
    const response = NextResponse.json({
      user: {
        uid: data.localId,
        email: data.email,
      },
      name,
    });

    response.cookies.set('token', data.idToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 deň
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
