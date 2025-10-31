/**
 * Login functions
 *
 * This file centralizes helper functions related to the user login flow.
 *
 * Currently contains:
 * 1. handleLogin() – performs login request and manages user state
 */

import { setUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';
import type { My_Type_LoginParams } from '@pexeso/_inc/my_types';
import { isLike_My_Type_User } from '@pexeso/_inc/functions/general';

// Mapping error code / alert for i18n
import { loginPageErrorMap } from '@pexeso/_inc/constants';

/**
 * handleLogin
 *
 * Performs login request to backend API and manages state updates.
 *
 * Flow:
 * 1. Validate client origin (CSRF protection)
 * 2. POST credentials to `/api/login`
 * 3. Handle backend error codes by mapping them to translation keys
 * 4. On success → update Redux store with user data and run navigation callback
 *
 * @param {Object} params
 * @param {string} params.email - User email
 * @param {string} params.password - User password
 * @param {Function} params.dispatch - Redux dispatch for updating auth state
 * @param {(error: string) => void} params.setError - Sets translated error key
 * @param {(loading: boolean) => void} params.setIsLoading - Toggles loading spinner
 * @param {() => void} params.navigation - Callback executed after successful login (e.g., redirect)
 */
export const handleLogin = async ({
  email,
  password,
  dispatch,
  setError,
  setIsLoading,
  navigation,
}: My_Type_LoginParams) => {
  // 1. CSRF protection: ensure request is from allowed origin
  if (!verifyClientOrigin()) {
    setError('invalid_origin');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    // 2. Send POST request to API
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      const translatedKey =
        loginPageErrorMap[data.error] || 'reg_page.error_alert.unexpected';
      setError(translatedKey);
      return;
    }

    // If user from api is not type my_type_user type -> set unexpected error
    if (!isLike_My_Type_User (data.user)){
      setError('reg_page.error_alert.unexpected');
      return;
    }

    // 3. Save authenticated user to Redux
    dispatch(
      setUser(data.user)
    );

    // 4. Success → redirect to home (or custom callback)
    navigation();
  } catch (err) {
    setError('login_page.error_alert');
  } finally {
    setIsLoading(false);
  }
};
