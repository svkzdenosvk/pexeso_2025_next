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
 * Goal:
 *   - Keep async API logic outside UI components
 *   - Provide reusable form validation logic
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
