'use client';
/**
 * Login functions
 *
 * This file centralizes helper functions related to the user login flow.
 *
 * Currently contains:
 * 1. handleLoginSubmit() – performs login request, maps errors, updates Redux, and redirects
 */

import { AppDispatch } from '@pexeso/lib/redux/store/store';
import { setUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import { loginAction } from '@pexeso/app/actions/loginAction';
import { redirect } from 'next/navigation';

/**
 * Mapping of backend error codes to i18n translation keys.
 * Used to display localized error messages in the UI.
 */
const errorMap: Record<string, string> = {
  invalid_credentials: 'login_page.error_alert.invalid_credentials',
  missing_credentials: 'login_page.error_alert.missing_credentials',
  too_many_req: 'login_page.error_alert.too_many_req',
  login_failed: 'login_page.error_alert.login_failed',
  unknown_err: 'login_page.error_alert.unknown_err',
  not_allowed_origin: 'invalid_origin',
};

/**
 * handleLoginSubmit
 *
 * Encapsulates the entire login workflow:
 * 1. Validates email format (client-side)
 * 2. Calls `loginAction` on the server to authenticate
 * 3. Maps backend error codes to translation keys (for UI)
 * 4. Updates Redux store with authenticated user on success
 * 5. Redirects user to homepage
 * 6. Returns a string error key if login fails, or `null` on success
 *
 * @param {object} params - Login parameters
 * @param {string} params.email - User email
 * @param {string} params.password - User password
 * @param {AppDispatch} params.dispatch - Redux dispatch function
 * @returns {Promise<string | null>} Error key for translation, or null on success
 */
export async function handleLoginSubmit({
  email,
  password,
  dispatch,
}: {
  email: string;
  password: string;
  dispatch: AppDispatch;
}): Promise<string | null> {
  // --- Step 1: Client-side validation (email format)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'reg_page.error_alert.email_format';
  }

  try {
    // --- Step 2: Attempt login via server action
    const res = await loginAction({ email, password });

    // --- Step 3: Handle backend error response
    if ('error' in res) {
      const rawError = res.error ?? 'login_failed';
      return errorMap[rawError] ?? 'reg_page.error_alert.unexpected';
    }

    // --- Step 4: Successful login
    // Update Redux store with authenticated user
    dispatch(setUser(res.user));

    // --- Step 5: Redirect user to homepage
    redirect('/');
  } catch (err) {
    // --- Step 6: Unexpected runtime/network error
    console.error('Unexpected login error:', err);
    return 'unknown_err';
  }
}
