/**
 * Origin Validation Utilities
 * ---------------------------
 * Provides both frontend and backend helpers for validating request origins.
 *
 * Purpose:
 *   - Prevent unauthorized cross-origin requests.
 *   - Ensure requests come only from trusted domains.
 *
 * Usage:
 *   - verifyClientOrigin() → Checks browser's window.origin against allowed list.
 *   - verifyApiOrigin()    → Checks API request 'origin' header against allowed list.
 *
 */

/**
 * List of allowed origins (domains) from which POST requests can be accepted.
 * This is used both in the frontend and backend for security checks.
 */
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://pexeso-next.netlify.app',
] as const;

export type AllowedOrigin = (typeof ALLOWED_ORIGINS)[number];

/**
 * Frontend origin verification.
 * Checks whether the current browser origin is in the allowed list.
 *
 * @returns True if the origin is allowed, otherwise false.
 */
export const verifyClientOrigin = (): boolean => {
  if (typeof window === 'undefined') return true; // Allow during SSR (Server-Side Rendering)

  const currentOrigin = window.location.origin;
  const isValid = ALLOWED_ORIGINS.includes(currentOrigin as AllowedOrigin);

  if (!isValid) {
    console.error(`Invalid origin: ${currentOrigin}`);
  }

  return isValid;
};

/*--------------------------------------------------------------------------*/

/**
 * Backend (API) origin verification.
 * Checks if the provided origin header is in the allowed list.
 *
 * @param origin - The request origin (or null if not provided).
 * @returns True if the origin is allowed, otherwise false.
 */
export const verifyApiOrigin = (origin: string | null): boolean => {
  if (!origin) return false;

  const isValid = ALLOWED_ORIGINS.includes(origin as AllowedOrigin);

  return isValid;
};
