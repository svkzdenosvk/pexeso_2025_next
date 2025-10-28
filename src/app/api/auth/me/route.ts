import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@pexeso/lib/prisma/prisma';
import {
  verifyShortToken,
  verifyLongToken,
  signShortToken,
} from '@pexeso/lib/jwt/jwt_helper';
import { cookies } from 'next/headers';

/**
 * Auth Check API Route Handler (JWT + Cookies + Prisma)
 *
 * Purpose:
 * - Verifies whether a user is currently logged in based on JWT tokens stored in cookies.
 * - Automatically refreshes the short-term token if the long-term token is still valid.
 *
 * Flow:
 * 1. Try to verify the short-term token.
 * 2. If invalid or expired, verify the long-term token instead.
 * 3. If the long-term token is valid, issue a new short-term token.
 * 4. Return the user's login state and basic profile data.
 *
 * @method GET
 * @returns JSON response:
 * {
 *   isLoggedIn: boolean,
 *   id?: number,
 *   email?: string,
 *   name?: string
 * }
 */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const shortToken = cookieStore.get('shortTerm_token')?.value;
  const longToken = cookieStore.get('longTerm_token')?.value;

  // ---------- 1 Validate short-term token first
  if (shortToken) {
    const decodedShort = verifyShortToken(shortToken);
    if (decodedShort?.id) {
      const user = await prisma.users.findUnique({
        where: { id: decodedShort.id },
      });

      if (user) {
        return NextResponse.json({
          isLoggedIn: true,
          id: user.id,
          email: user.email,
          name: user.name,
        });
      }
    }
  }

  // ---------- 2. Short-term token invalid or missing → check long-term (refresh) token
  if (!longToken) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  const decodedLong = verifyLongToken(longToken);
  if (!decodedLong?.id) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  // ---------- 3. Verify that the user still exists in the database (via Prisma)

  const user = await prisma.users.findUnique({ where: { id: decodedLong.id } });

  if (!user) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  // ---------- 4 Issue a new short-term token (refresh session)
  const newShortToken = signShortToken(user.id, user.email);

  const response = NextResponse.json({
    isLoggedIn: true,
    id: user.id,
    email: user.email,
    name: user.name,
  });

  response.cookies.set('shortTerm_token', newShortToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes (in seconds)
  });

  return response;
}
