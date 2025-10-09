import { NextResponse } from 'next/server';

/**
 * Handles user logout via GET request.
 *
 * Workflow:
 * 1. Deletes the "token" cookie by setting it to an empty value and an expired date
 * 2. Returns JSON response { success: true }
 *
 * @method GET
 * @returns JSON response and clears auth cookie
 */

// GET handler for logout user -> after click on log out buttton -> user´s cookie will be deleted
export async function GET(req: Request) {

    // NOTE: Validation request origin (basic CORS protection) with verifyApiOrigin() not working correctly -> it triggers error

  // ---------- 1. Create response object
  const response = NextResponse.json({ success: true });

  /** ---------- 2. Clear authentication cookie ("token")
   * Cookie is removed by:
   * - Setting empty value
   * - Setting expiration date in the past
   */
  response.cookies.set('token', '', {
    httpOnly: true, // Prevent JS access to cookie (security best practice)
    // secure: process.env.NODE_ENV !== 'development', //this working on deploy and localhost
    secure: true, 
    sameSite: 'lax', 
    path: '/', // Applies for entire domain
    expires: new Date(0), // Expire immediately
  });

  // ---------- 3. Return the response with cookie cleared
  return response;
}
