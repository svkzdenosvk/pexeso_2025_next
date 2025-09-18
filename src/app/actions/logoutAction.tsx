// app/actions/logoutAction.ts
'use server';

import { cookies } from 'next/headers';

/**
 * logoutAction
 *
 * Server action handling user logout.
 *
 * Workflow:
 * 1. Access user cookies
 * 2. Remove the "token" cookie by setting it to an empty value and expiring it
 * 3. Return `{ success: true }` on success
 * 4. Catch and log any errors, returning `{ success: false }`
 *
 * @returns {Promise<{ success: boolean }>}
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  // --- Step 1: Access cookies store
  const my_cookies = await cookies();
  try {
    // --- Step 2: Remove cookie by expiring it
    my_cookies.set('token', '', {
      httpOnly: true, // Prevent JS access to cookie (security best practice)
      secure: true, // Always use secure flag
      sameSite: 'lax', // CSRF protection
      path: '/', // Applies for entire domain
      expires: new Date(0), // Expire immediately
    });

    // --- Step 3: Return success response
    return { success: true };
  } catch (err) {
    // --- Step 4: Handle unexpected runtime errors
    console.error('Logout action failed:', err);
    return { success: false };
  }
}
