/**
 * Login & Registration Utilities
 *
 * This file centralizes helper functions used across the authentication flow,
 * keeping UI components clean and reusable. It focuses on two main areas:
 *
 * 1. validateRegistration()
 *    - Validates form fields before submission
 *    - Returns translation keys used for localized error messages
 * 2. Error handling (server-side)
 *    - `handleAuthError()` extracts backend error responses (via RTK Query),
 *      maps them to translation keys, and updates component state with a
 *      user-friendly error message.
 *
  * Purpose:
 * - Keep complex logic (validation, error parsing) out of components
 * - Reuse the same logic across login and registration flows
 * - Ensure consistent error handling and translation mapping
 */
import type { My_Type_RegistrationForm } from '@pexeso/_inc/my_types';

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

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { My_Type_ErrorResponse } from '@pexeso/_inc/my_types';

/**
 * Extracts a server error code from a FetchBaseQueryError and maps it to a translated message.
 *
 * @param err - The raw error object from RTK Query.
 * @param errorMap - An object mapping server error codes to translation keys.
 * @param setError - A state setter function for storing the translated error message.
 * @param defaultKey - (Optional) fallback translation key when the error code is unknown.
 */
export function handleAuthError(
  err: unknown,
  errorMap: Record<string, string>,
  setError: (msg: string) => void,
  defaultKey = 'reg_page.error_alert.unexpected'
) {
  const fbqError = err as FetchBaseQueryError;
  if (fbqError?.data && typeof fbqError.data === 'object') {
    const errData = fbqError.data as My_Type_ErrorResponse;
    if (errData?.error) {
      const translated = errorMap[errData.error] || defaultKey;
      setError(translated);
    }
  }
}
