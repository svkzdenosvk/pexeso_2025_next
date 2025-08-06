import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from '@pexeso/lib/firebase/firebase-admin';
import { verifyApiOrigin } from '@pexeso/_inc/data';

/**
 * Auth Check API Route Handler
 *
 * Flow:
 * 1. Validate request origin (basic CORS protection)
 * 2. Read authentication token from cookies
 * 3. Verify token using Firebase Admin SDK
 * 4. Retrieve user information based on UID
 * 5. Return login status and user details
 *
 * @method GET
 * @returns JSON with { isLoggedIn: boolean, uid, email, name? }
 */

// GET handler -> checking if user is logged in from cookies
export async function GET(req: Request) {
  // ---------- 1. Validate request origin (basic CORS protection)
  const origin = req.headers.get('origin');

  if (!verifyApiOrigin(origin)) {
    return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  }

  // ---------- 2. Load cookies and extract token
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // if token not exists -> user is not logged in
  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    // ---------- 3. Token validation by Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);

    // ---------- 4. Loading info about user by UID from token
    const user = await adminAuth.getUser(decoded.uid);

    // ---------- 5. Return login status and user data
    return NextResponse.json({
      isLoggedIn: true,
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
    });
  } catch (err) {
    
    // ---------- 6. Token verification failed (expired, invalid, etc.)
    console.error('Auth check error:', err);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
