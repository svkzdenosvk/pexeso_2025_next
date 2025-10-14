/**
 * Registration functions
 *
 * This file centralizes helper functions for handling user registration flow.
 * Unlike the Firebase variant, this version delegates user creation to
 * a custom Next.js API route (`/api/registration`) instead of Firebase SDK.
 *
 * 1. validateRegistration()
 *    - Validates form fields before submission
 *    - Returns translation keys used for localized error messages
 *
 * 2. handleRegister()
 *    - Verifies request origin (anti-CSRF)
 *    - Sends registration data to `/api/registration`
 *    - Maps backend error codes to translated keys
 *    - On success → resets form and redirects to login page
 *
 * Goal:
 *   - Keep async API logic outside UI components
 *   - Provide reusable form validation logic
 */
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';
import type {
  My_Type_RegistrationForm,
  My_Type_RegisterParams,
} from '@pexeso/_inc/my_types';

// Map server error codes to translation keys
import { registerPageErrorMap } from '@pexeso/_inc/constants';
/**
 * Validates registration form fields before sending data to the API.
 *
 * Rules:
 * - Name: min 3, max 50 chars
 * - Email: must match simple regex pattern
 * - Password: 6–20 chars, at least one uppercase, at least one special char
 * - Confirm: must match password
 *
 * @param {My_Type_RegistrationForm} form - Registration form values
 * @returns {string} translation key of validation error, or empty string if valid
 */
export const validateRegistration = (
  form: My_Type_RegistrationForm
): string => {
  const { password, confirm, name, email } = form;

  if (name.length < 3) return 'reg_page.error_alert.name_length_min';
  if (name.length > 50) return 'reg_page.error_alert.name_length_max';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'reg_page.error_alert.email_format';

  if (password.length < 6 || password.length > 20)
    return 'reg_page.error_alert.pass_length';
  if (!/[A-Z]/.test(password)) return 'reg_page.error_alert.pass_upper';
  if (!/[0-9]/.test(password)) return 'reg_page.error_alert.pass_number';
  if (!/[!@#$%^&*-]/.test(password)) return 'reg_page.error_alert.pass_special';
  if (password !== confirm) return 'reg_page.error_alert.pass_confirm';

  return '';
};

/**
 * Handles registration process using custom Next.js API route.
 *
 * Flow:
 * 1. Validate client origin (CSRF protection)
 * 2. POST form data to `/api/register`
 * 3. Handle backend error codes by mapping them to translation keys
 * 4. On success → reset form and redirect to `/login?fromRegister=true`
 */
export const handleRegister = async ({
  form,
  setError,
  setIsLoading,
  resetForm,
  router,
}: My_Type_RegisterParams) => {
  // 1. CSRF protection: ensure request is from allowed origin
  if (!verifyClientOrigin()) {
    setError('invalid_origin');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    // 2. Call backend registration API
    const res = await fetch('/api/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(registerPageErrorMap[data.error] || 'reg_page.error_alert.unexpected');
      return;
    }

    //  Success: reset form & redirect to login
    resetForm();
    router.push('/login?fromRegister=true');
  } catch (err) {
    // Handle network errors (fetch failed, offline, etc.)
    if (err instanceof TypeError)
      setError('reg_page.error_alert.network_error');
    else setError('reg_page.error_alert.unexpected');
    console.error('Registration error:', err);
  } finally {
    setIsLoading(false);
  }
};
