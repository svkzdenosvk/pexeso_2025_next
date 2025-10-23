import { NextResponse } from 'next/server';

/**
 * Logout API Route
 *
 * Clears both access and refresh token cookies.
 *
 * @method GET
 * @returns JSON { success: true } and clears auth cookies
 */

// export async function POST(req: Request): Promise<NextResponse> { //maybe try this for TS
// GET handler for logout user -> after click on log out buttton -> user´s cookie will be deleted
export async function GET(req: Request) {

  // NOTE: Validation request origin (basic CORS protection) with verifyApiOrigin() not working correctly -> it triggers error

  // ---------- 1. Create response object
  const response = NextResponse.json({ success: true });

  // ----------  Clear Access Token
  response.cookies.set('shortTerm_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // expire immediately
  });

  // ----------  Clear Refresh Token
  response.cookies.set('longTerm_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // expire immediately
  });

  // ---------- 3. Return the response with cookie cleared
  return response;
}
