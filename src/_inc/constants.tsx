/*This file centralized some constants to refactor coe  */

 // Error translation mapping
export const registerErrorMap: Record<string, string> = {
    email_registered: 'reg_page.error_alert.email_registered',
    missing_credentials: 'reg_page.error_alert.missing_credentials',
    req_failed: 'reg_page.error_alert.reg_failed',
    not_allowed_origin: 'invalid_origin',
  };

/**
 * Mapping of backend error codes to i18n translation keys.
 * Used to display localized error messages in the UI.
//  */
// export const registerErrorMap: Record<string, string> = {
//   email_registered: 'reg_page.error_alert.email_registered',
//   missing_credentials: 'reg_page.error_alert.missing_credentials',
//   req_failed: 'reg_page.error_alert.reg_failed',
// };

/**
 * Mapping of backend error codes to i18n translation keys.
 * Used to display localized error messages in the UI.
 */
export const loginErrorMap: Record<string, string> = {
  invalid_credentials: 'login_page.error_alert.invalid_credentials',
  missing_credentials: 'login_page.error_alert.missing_credentials',
  too_many_req: 'login_page.error_alert.too_many_req',
  login_failed: 'login_page.error_alert.login_failed',
  unknown_err: 'login_page.error_alert.unknown_err',
  not_allowed_origin: 'invalid_origin',
};