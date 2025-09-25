/**
 * constants.ts
 *
 * Centralized constants for error code mappings used throughout the app.
 * These mappings help translate backend or Firebase error codes
 * into i18n translation keys that can be displayed to the user.
 *
 */

/**
 * Maps backend error responses from the registration API
 * Used in registration page
 */
export const registerPageErrorMap: Record<string, string> = {
    email_registered: 'reg_page.error_alert.email_registered',
    missing_credentials: 'reg_page.error_alert.missing_credentials',
    req_failed: 'reg_page.error_alert.reg_failed',
    not_allowed_origin: 'invalid_origin',
  };


/**
 * Maps backend error responses from the login API
 * Used in login page
 */
export const loginPageErrorMap: Record<string, string> = {
  invalid_credentials: 'login_page.error_alert.invalid_credentials',
  missing_credentials: 'login_page.error_alert.missing_credentials',
  too_many_req: 'login_page.error_alert.too_many_req',
  login_failed: 'login_page.error_alert.login_failed',
  unknown_err: 'login_page.error_alert.unknown_err',
  not_allowed_origin: 'invalid_origin',
};

/**
 * Mapping of Firebase error codes to custom i18n-friendly keys.
 * Used in api login route
 */
export const firebaseLoginRouteErrorMap: Record<string, string> = {
  INVALID_PASSWORD: 'invalid_credentials',
  EMAIL_NOT_FOUND: 'invalid_credentials',
  MISSING_PASSWORD: 'missing_credentials',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'too_many_req',
  USER_DISABLED: 'login_failed',
};