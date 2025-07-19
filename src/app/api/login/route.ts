import { NextResponse } from 'next/server';
import { My_Type_Login } from '@pexeso/_inc/my_types';
import { adminDB } from '@pexeso/lib/firebase/firebase-admin';
import { verifyApiOrigin } from '@pexeso/_inc/data';

// maping error code / alert for i18n
const firebaseErrorMap: Record<string, string> = {
  INVALID_PASSWORD: 'invalid_credentials',
  EMAIL_NOT_FOUND: 'invalid_credentials',
  MISSING_PASSWORD: 'missing_credentials',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'too_many_req',
  USER_DISABLED: 'login_failed',
};

// POST login handler
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  
  //origin protection
  if (!verifyApiOrigin(origin)) {
    return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  }

  try {
    // loading credentials from request
    const { email, password }: My_Type_Login = await req.json();

    // if missing email or password -> error
    if (!email || !password) {
      return NextResponse.json(
        { error: 'missing_credentials' },
        { status: 400 }
      );
    }

    // call Firebase Identity Toolkit REST API for login verification
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

    // decoding response from Firebase
    const data = await res.json();

    // if Firebase return error
    if (!res.ok) {
      const firebaseError = data.error?.message ?? 'UNKNOWN';
      const mappedError = firebaseErrorMap[firebaseError] ?? 'login_failed';

      return NextResponse.json({ error: mappedError }, { status: 401 });
    }

    // get user name from Firestore by UID
    const userRef = adminDB.collection('users').doc(data.localId);
    const userSnap = await userRef.get();

    const name = userSnap.exists ? (userSnap.data()?.name ?? '') : '';

    // create response with user INFO
    const response = NextResponse.json({
      user: {
        uid: data.localId,
        email: data.email,
      },
      name,
    });

    // setup cookies with token for authentication
    response.cookies.set('token', data.idToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);

    // if network error, request failed at all
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return NextResponse.json({ error: 'net_req_failed' }, { status: 503 });
    }

    //unknown error
    return NextResponse.json({ error: 'unknown_err' }, { status: 500 });
  }
}
