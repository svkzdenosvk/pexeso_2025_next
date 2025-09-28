import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API Slice
 *
 * Central API layer used by the entire application.
 *
 * Responsibilities:
 * - Provides a base query configuration for all API endpoints
 * - Serves as a parent slice for feature-specific API services (e.g., `authApi`, `gameApi`)
 * - Handles automatic cookie sending (`credentials: 'include'`) for authenticated requests
 *
 * Usage:
 * - Extend this slice with `.injectEndpoints()` in feature-specific service files
 * - Each feature service defines its own queries and mutations based on this base configuration
 *
 * Example:
 * ```ts
 * const extendedApi = apiSlice.injectEndpoints({
 *   endpoints: (builder) => ({
 *     login: builder.mutation({...})
 *   })
 * })
 * ```
 */

// Main API slice configuration
export const apiSlice = createApi({
  reducerPath: 'api', // Unique name used in the Redux state tree

  // Global base configuration for all API requests
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // All endpoints will be relative to this base path
    credentials: 'include', // Automatically include cookies with requests
  }),
  endpoints: () => ({}), // left empty; feature endpoints are injected separately via `injectEndpoints` in their respective files
});
