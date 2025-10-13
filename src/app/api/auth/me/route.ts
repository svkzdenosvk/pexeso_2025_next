import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@pexeso/lib/prisma/prisma';
import { verifyToken } from '@pexeso/lib/jwt/jwt_helper';

/**
 * Auth Check API Route Handler (JWT + PostgreSQL + Prisma)
 *
 * Purpose:
 * - Verifies whether a user is currently logged in based on JWT token in cookies.
 *
 * Flow:
 * 1. Extract token from cookies
 * 2. Validate and decode JWT token
 * 3. Verify that the decoded user still exists in the database
 * 4. Return user's login state and basic info
 *
 * @method GET
 * @returns JSON response:
 * {
 *   isLoggedIn: boolean,
 *   uid?: number,
 *   email?: string,
 *   name?: string
 * }
 */

// GET handler -> checking if user is logged in from cookies
export async function GET(req: NextRequest) {
  // NOTE: Validation request origin (basic CORS protection) with verifyApiOrigin() not working correctly -> it triggers error

  // ---------- 1. Extract JWT token from cookies
  const token = req.cookies.get('token')?.value;

  // if token present  -> user is not logged in
  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  // ---------- 2. Validate and decode token payload
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    // Defensive check — ensure decoded token contains valid user ID
    if (!decoded.id || isNaN(decoded.id)) {
      throw new Error('Invalid token');
    }

    // ---------- 3. Find user in DB
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    // If user no longer exists (deleted, etc.)
    if (!user) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    // ---------- 4. Return login status and user data
    return NextResponse.json({
      isLoggedIn: true,
      uid: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    // ---------- 5. Catch token verification or DB lookup errors
    console.error('Auth check error:', err);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
