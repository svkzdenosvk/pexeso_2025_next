// app/api/logout/route.ts
import { NextResponse } from 'next/server';

// after click on log out -> destroy cookies
export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // vypršala v minulosti
  });

  return response;
}
