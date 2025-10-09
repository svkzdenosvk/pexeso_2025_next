import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@pexeso/lib/prisma/prisma';
import { verifyToken } from '@pexeso/lib/jwt/jwt_helper';

/**
* Auth Check API Route Handler (PostgreSQL + Prisma)
 *
 * Flow:
 * 1. Extract token from cookies
 * 2. Decode user ID from token
 * 3. Look up user in database
 * 4. Return login status and user details
 *
 * @method GET
 * @returns JSON with { isLoggedIn: boolean, uid, email, name? }
 */

// GET handler -> checking if user is logged in from cookies
export async function GET(req: NextRequest) {

   // NOTE: Validation request origin (basic CORS protection) with verifyApiOrigin() not working correctly -> it triggers error


  // ---------- 2. Load cookies and extract token
  const token = req.cookies.get('token')?.value;

  // if token not exists -> user is not logged in
  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

   // ---------- 3. Token validation
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
     // ---------- 2. Decode token (format: base64 of "id:timestamp")
    // const decoded = Buffer.from(token, 'base64').toString('utf-8');
    // const [id] = decoded.split(':');
    // const userId = Number(id);

    if (!decoded.id || isNaN(decoded.id)) {
      throw new Error('Invalid token');
    }

    // ---------- 3. Find user in DB
    const user = await prisma.users.findUnique({
      // where: { id: userId },
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }
  
    // ---------- 5. Return login status and user data
    return NextResponse.json({
      isLoggedIn: true,
      uid: user.id,
      email: user.email,
      // name: user.name || '',
      name: user.name ,

    });
  } catch (err) {
    // ---------- 6. Token verification failed (expired, invalid, etc.)
    console.error('Auth check error:', err);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
