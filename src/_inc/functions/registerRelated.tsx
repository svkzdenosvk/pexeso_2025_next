/**
 * Registration functions
 *
 * This file centralizes helper functions related to the user registration flow.
 *
 * Currently contains:
 * 1. validateRegistration() – client-side validation of form fields
 */

import type { My_Type_RegistrationForm } from '@pexeso/_inc/my_types';

/**
 * validateRegistration
 *
 * Validates registration form fields before sending data to the server:
 * 1. Name – 3–50 chars
 * 2. Email – must be valid format
 * 3. Password – 6–20 chars, with uppercase, number, and special char
 * 4. Confirm – must match password
 *
 * @param {My_Type_RegistrationForm} form - User input from registration form
 * @returns {string} Translation key for error, or empty string if valid
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




