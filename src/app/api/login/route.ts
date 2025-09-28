import { NextResponse } from 'next/server';
import { My_Type_Login } from '@pexeso/_inc/my_types';
import { adminDB } from '@pexeso/lib/firebase/firebase-admin';
import { verifyApiOrigin } from '@pexeso/_inc/functions/originValidation';
import { firebaseLoginRouteErrorMap } from '@pexeso/_inc/constants';

/**
 * Login API Route Handler
 *
 * Flow:
 * 1. Validate request origin (basic CORS protection)
 * 2. Parse login credentials from request body
 * 3. Authenticate user via Firebase Auth REST API
 * 4. Fetch user's name from Firestore
 * 5. Set auth token in cookie
 * 6. Return user details
 *
 * @method POST
 * @returns JSON with user data + authentication cookie
 */

// POST login handler
export async function POST(req: Request) {
  // ---------- 1. Validate origin to prevent unauthorized requests (CORS)
  const origin = req.headers.get('origin');

  if (!verifyApiOrigin(origin)) {
    console.warn('Blocked origin:', origin);
    return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  }

  try {
    // ---------- 2. Parse email and password from request body
    const { email, password }: My_Type_Login = await req.json();

    // ---------- 3. Validate presence of credentials
    if (!email || !password) {
      return NextResponse.json(
        { error: 'missing_credentials' },
        { status: 400 }
      );
    }

    // ---------- 4. Authenticate user via Firebase Identity Toolkit REST API
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

    // ---------- 5. Decode response from Firebase
    const data = await res.json();

    // Handle failed login attempts
    if (!res.ok) {
      console.warn('Firebase login error on login route:', data); //

      const firebaseError = data.error?.message ?? 'UNKNOWN';
      const mappedError =
        firebaseLoginRouteErrorMap[firebaseError] ?? 'login_failed';

      return NextResponse.json({ error: mappedError }, { status: 401 });
    }

    // ---------- 6. Fetch user's name from Firestore (optional enhancement)
    const userRef = adminDB.collection('users').doc(data.localId);
    const userSnap = await userRef.get();

    const name = userSnap.exists ? (userSnap.data()?.name ?? '') : '';

    // ---------- 7. Construct response with user details

    const response = NextResponse.json({
      user: {
        uid: data.localId,
        email: data.email,
        name,
      },
    });
    // ---------- 8. Setup cookies with token for authentication
    response.cookies.set('token', data.idToken, {
      httpOnly: true, // Cookie is not accessible via JS
      path: '/', // Applies to entire site
      // secure: process.env.NODE_ENV !== 'development', or secure:false for localhost version
      secure: true,
      maxAge: 60 * 60 * 24, // 1 day (in seconds)
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    // console.error('Login error:', err);

    // ---------- 9. Network or fetch-related error
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return NextResponse.json({ error: 'net_req_failed' }, { status: 503 });
    }

    // ---------- 10. Unknown server error
    return NextResponse.json({ error: 'unknown_err' }, { status: 500 });
  }
}
