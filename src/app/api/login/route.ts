import { NextResponse } from 'next/server';
import { prisma } from '@pexeso/lib/prisma/prisma';
import { My_Type_Login } from '@pexeso/_inc/my_types';
import { signShortToken, signLongToken } from '@pexeso/lib/jwt/jwt_helper';
import { verifyApiOrigin } from '@pexeso/_inc/functions/originValidation';
import bcrypt from 'bcrypt';

/**
 * Login API Route Handler (PostgreSQL + JWT)
 *
 * Flow:
 * 1. Validate request origin (basic CORS protection)
 * 2. Parse and validate login credentials
 * 3. Find user in PostgreSQL via Prisma
 * 4. Compare password hash with bcrypt
 * 5. Generate JWT token
 * 6. Set token in secure HTTP-only cookie
 * 7. Return user data in response
 *
 * @method POST
 * @returns JSON with user data + authentication cookie
 */

// POST login handler
export async function POST(req: Request) {
  // ---------- 1. Validate origin (basic anti-CSRF)
  const origin = req.headers.get('origin');

  if (!verifyApiOrigin(origin)) {
    console.warn('Blocked origin:', origin);
    return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  }

  try {
    // ---------- 2. Parse email and password from request body
    const { email, password }: My_Type_Login = await req.json();

    // ---------- 3. Basic field validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'missing_credentials' },
        { status: 400 }
      );
    }
    // ---------- 4. Find user in database
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'invalid_credentials' },
        { status: 401 }
      );
    }

    // ---------- 5. Compare password with bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'invalid_credentials' },
        { status: 401 }
      );
    }

    // ---------- 6. Generate JWT token
    const shortToken = signShortToken(user.id, user.email); 
    const longToken = signLongToken(user.id);             
    // const token = signToken(user.id, user.email);

    // ---------- 7. Construct JSON response with user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
   
    // ---------- 8. Setup cookies with token for authentication
    
    // ---------- Short term access token cookie
    response.cookies.set('shortTerm_token', shortToken, {
      httpOnly: true, // Cookie is not accessible via JS
      path: '/', // Applies to entire site
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 minutes (in seconds)
      sameSite: 'lax',
    });

    // ---------- Long term refresh token cookie
    response.cookies.set('longTerm_token', longToken, {
      httpOnly: true, // Cookie is not accessible via JS
      path: '/', // Applies to entire site
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days (in seconds)
      sameSite: 'lax',
    });
 
    return response;
  } catch (err: any) {
    // console.error('Login error:', err);

    // ---------- 9. Network or fetch-related error
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return NextResponse.json({ error: 'net_req_failed' }, { status: 503 });
    }

    // ---------- 10. Fallback for unknown errors
    return NextResponse.json({ error: 'unknown_err' }, { status: 500 });
  }
}
