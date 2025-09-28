import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@pexeso/lib/firebase/firebase-admin';

/**
 * Auth Check API Route Handler
 *
 * Flow:
 * 1. Read authentication token from cookies
 * 2. Verify token using Firebase Admin SDK
 * 3. Retrieve user information based on UID
 * 4. Return login status and user details
 *
 * @method GET
 * @returns JSON with { isLoggedIn: boolean,  uid?: string, email?: string, name?: string }
 */

// GET handler -> checking if user is logged in from cookies
export async function GET(req: NextRequest) {
  // NOTE: Validation request origin (basic CORS protection) with verifyApiOrigin() not working correctly -> it triggers error

  // ---------- 1. Load cookies and extract token
  const token = req.cookies.get('token')?.value;

  // if token not exists -> user is not logged in
  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    // ---------- 2. Token validation by Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);

    // ---------- 3. Loading info about user by UID from token
    const user = await adminAuth.getUser(decoded.uid);

    // ---------- 4. Return login status and user data
    return NextResponse.json({
      isLoggedIn: true,
      user: {
        uid: user.uid,
        email: user.email ?? '',
        name: user.displayName ?? '',
      },
  
    });
  } catch (err) {
    // ----------  Token verification failed (expired, invalid, etc.)
    console.error('Auth check error:', err);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
