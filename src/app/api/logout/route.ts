import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Logout API Route Handler (JWT + Cookies)
 *
 * Purpose:
 * - Logs out the user by clearing both short-term and long-term JWT cookies.
 *
 * Flow:
 * 1. Create a response object.
 * 2. Clear both JWT cookies (shortTerm_token & longTerm_token).
 * 3. Return success response to confirm logout.
 *
 * @method GET
 * @returns JSON response:
 * {
 *   success: boolean
 * }
 */
// export async function POST(req: Request): Promise<NextResponse> { //maybe try this for TS
// GET handler for logout user -> after click on log out buttton -> user´s cookie will be deleted
export async function GET(req: Request) {

  // NOTE: Validation request origin (basic CORS protection) with verifyApiOrigin() not working correctly -> it triggers error
 const cookieStore = await cookies();

  // ---------- 1. Create response object
  const response = NextResponse.json({ success: true });

  // ---------- 2. Clear Access (short term token) Token
  response.cookies.set('shortTerm_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // expire immediately
  });

  // ---------- 3. Clear Refresh (long term token) Token
  response.cookies.set('longTerm_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // expire immediately
  });

  // ---------- 4. Return the response with cleared cookies
  return response;
}
