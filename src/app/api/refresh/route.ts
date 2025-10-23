import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@pexeso/lib/prisma/prisma';
import { verifyLongToken, signShortToken } from '@pexeso/lib/jwt/jwt_helper';

export async function POST(req: Request) {
  
  // ---------- 1 Get refresh token from cookies
  // const refreshToken = req.headers.get("cookie")?.split("longToken=")[1]?.split(";")[0];
  const cookieStore = await cookies();
  const longToken = cookieStore.get('long_token')?.value;

  if (!longToken) {
    //error spracovat missing_refresh aj s i18n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return NextResponse.json({ error: 'missing_refresh' }, { status: 401 });
  }

  // ---------- 2 Verify refresh long term token
  const decoded = verifyLongToken(longToken);
  if (!decoded) {     //error spracovat invalid_refresh aj s i18n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return NextResponse.json({ error: 'invalid_refresh' }, { status: 401 });
  }

  // ---------- 3️⃣ Skontroluj, či token existuje v DB a nie je expirovaný
  const stored = await prisma.longTermToken.findUnique({
    where: { token: longToken },
  });

  if (!stored || stored.expiresAt < new Date()) {
    //error spracovat expired_refresh aj s i18n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return NextResponse.json({ error: 'expired_refresh' }, { status: 401 });
  }

   // ---------- 4️⃣ Získaj email používateľa z DB
  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 401 });
  }

  // ---------- 5️⃣ Vytvor nový krátkodobý access token
  const newShortToken = signShortToken(decoded.id, '');
  const response = NextResponse.json({ success: true });

  response.cookies.set('shortTerm_token', newShortToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60, //15 minutes (in seconds)
     sameSite: "lax",
  });

  return response;
}
