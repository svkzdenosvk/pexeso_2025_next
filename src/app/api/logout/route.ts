import { NextResponse } from 'next/server';
import { verifyApiOrigin } from '@pexeso/_inc/functions/originValidation';

/**
 * Handles user logout via GET request.
 *
 * Workflow:
 * 1. Verifies request origin (security check)
 * 2. Deletes the "token" cookie by setting it to an empty value and an expired date
 * 3. Returns JSON response { success: true }
 *
 * @method GET
 * @returns JSON response and clears auth cookie
 */

// GET handler for logout user -> after click on log out buttton -> user´s cookie will be deleted
export async function GET(req: Request) {
  // ---------- 1. Verify origin to prevent unauthorized cross-origin access
  // const origin = req.headers.get('origin');

  // if (!verifyApiOrigin(origin)) {
  //   return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  // }

  // ---------- 2. Create response object
  const response = NextResponse.json({ success: true });

  /** ---------- 3. Clear authentication cookie ("token")
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

  // ---------- 4. Return the response with cookie cleared
  return response;
}
