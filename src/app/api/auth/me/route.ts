import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@pexeso/lib/prisma/prisma';
import { verifyShortToken, verifyLongToken, signShortToken } from '@pexeso/lib/jwt/jwt_helper';

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
    // 1️⃣ Skús short-term token (access)

  const shortToken  = req.cookies.get('shortTerm_token')?.value;

  // if token present  -> user is not logged in
  // if (!shortToken) {
  //   return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  // }
  if (shortToken) {
    const decoded = verifyShortToken(shortToken);
    if (decoded?.id) {
      const user = await prisma.users.findUnique({ where: { id: decoded.id } });
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

    // 2️⃣ Ak short-term token nie je platný → skús long-term (refresh)

 const longToken = req.cookies.get('longTerm_token')?.value;
  if (!longToken) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
  // ---------- 2. Validate and decode token payload
    const decodedLongToken = verifyLongToken(longToken);
  if (!decodedLongToken?.id) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

   // 3️⃣ Skontroluj, či refresh token ešte existuje a neexpiroval
  const stored = await prisma.longTermToken.findUnique({
    where: { token: longToken },
  });

  if (!stored || stored.expiresAt < new Date()) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  // try {
    // Defensive check — ensure decoded token contains valid user ID
    // if (!decoded.id || isNaN(decoded.id)) {
    //   throw new Error('Invalid token');
    // }

 // 4️⃣ Nájdeme používateľa podľa decoded.id
  const user = await prisma.users.findUnique({ where: { id: decodedLongToken.id } });
     // If user no longer exists (deleted, etc.)

  if (!user) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
    
// 5️⃣ Vygenerujeme nový short-term token
  const newShortToken = signShortToken(user.id, user.email);

  const response = NextResponse.json({
    isLoggedIn: true,
    id: user.id,
    email: user.email,
    name: user.name,
  });

      // 6️⃣ Uložíme nový short-term token do cookies
  response.cookies.set('shortTerm_token', newShortToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minút
  });
  // } catch (err) {
  //   // ---------- 5. Catch token verification or DB lookup errors
  //   console.error('Auth check error:', err);
  //   return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  // }
    return response;

}
