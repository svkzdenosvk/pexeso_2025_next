import { NextResponse } from 'next/server';
import { prisma } from '@pexeso/lib/prisma/prisma';
// import { My_Type_Login } from '@pexeso/_inc/my_types';
import { signToken } from '@pexeso/lib/jwt/jwt_helper';
import { verifyApiOrigin } from '@pexeso/_inc/functions/originValidation';
import bcrypt from 'bcrypt';

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

/**
 * Mapping of Firebase error codes to custom i18n-friendly keys.
 * These keys can be used on the frontend for displaying localized error messages.
 */
const firebaseErrorMap: Record<string, string> = {
  INVALID_PASSWORD: 'invalid_credentials',
  EMAIL_NOT_FOUND: 'invalid_credentials',
  MISSING_PASSWORD: 'missing_credentials',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'too_many_req',
  USER_DISABLED: 'login_failed',
};

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
    // const { email, password }: My_Type_Login = await req.json();
    // ---------- 2. Parse body
    const { email, password } = await req.json();

    // ---------- 3. Validate presence of credentials
    if (!email || !password) {
      return NextResponse.json(
        { error: 'missing_credentials' },
        { status: 400 }
      );
    }
    // ---------- 3. Find user in database
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'invalid_credentials' },
        { status: 401 }
      );
    }

    // ---------- 4. Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'invalid_credentials' },
        { status: 401 }
      );
    }

     // ✅ Generate JWT token
    const token = signToken(user.id, user.email);

    // ---------- 5. (Optional) Create JWT or session token
    // Na rýchlo môžeme použiť id ako pseudo-token: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // ---------- 7. Construct response with user details
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
    // ---------- 8. Setup cookies with token for authentication
    // response.cookies.set('token', data.idToken, {
    //  httpOnly: true, // Cookie is not accessible via JS
    //       path: '/', // Applies to entire site
    //       // secure: process.env.NODE_ENV !== 'development', or secure:false for localhost version
    //       secure: true,
    //       maxAge: 60 * 60 * 24, // 1 day (in seconds)
    //       sameSite: 'lax',
    //     });
    // ---------- 8. Setup cookies with token for authentication
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);

    // ---------- 9. Network or fetch-related error
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return NextResponse.json({ error: 'net_req_failed' }, { status: 503 });
    }

    // ---------- 10. Unknown server error
    return NextResponse.json({ error: 'unknown_err' }, { status: 500 });
  }
}
