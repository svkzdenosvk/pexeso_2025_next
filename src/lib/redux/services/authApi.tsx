import { apiSlice } from './apiSlice';
import { setUser, clearUser } from '../store/reducers/authSlice';
import type { My_Type_User, My_Type_Login } from '@pexeso/_inc/my_types';

/**
 * Authentication API Endpoints (RTK Query)
 *
 * This module defines all API endpoints related to authentication and user
 * session management. It extends the base `apiSlice` by injecting new endpoints
 * for login, registration, logout, and session validation (`auth/me`).
 *
 * Purpose:
 * - Centralize all authentication-related API calls in one place
 * - Keep UI components clean by delegating async logic to RTK Query
 * - Automatically generate React hooks for each endpoint
 *
 * Endpoints overview:
 * 1. login    - Authenticate user with credentials and store user in Redux
 * 2. register - Register a new user via custom API route
 * 3. logout   - Terminate session and clear cookies on the server
 * 4. authMe   - Verify user session and retrieve user data from cookies
 *
 * Notes:
 * - `onQueryStarted` in `login` is used to immediately update Redux state after a successful login.
 * - All endpoints communicate with Next.js API routes under `/api/auth/*`.
 */

// --- Inject authentication-related endpoints into the base API slice
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * LOGIN
     * Authenticates the user and updates the Redux store with the returned user data.
     */
    login: builder.mutation<{ user: My_Type_User }, My_Type_Login>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),

      // After login is successful, update Redux state with user info.
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUser({
              uid: data.user.uid,
              email: data.user.email,
              name: data.user.name,
            })
          );
        } catch {
          dispatch(clearUser());
        }
      },
    }),

    /**
     * REGISTER
     * Creates a new user account via the backend registration route.
     */
    register: builder.mutation<
      any,
      { name: string; email: string; password: string }
    >({
      query: (formData) => ({
        url: '/registration',
        method: 'POST',
        body: formData,
      }),
    }),

    /**
     * LOGOUT
     * Clears user session and invalidates authentication cookies.
     */
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
    }),

    /**
     * AUTH ME
     * Checks if the user is authenticated and returns their session data.
     */
    authMe: builder.query<{ isLoggedIn: boolean; user?: My_Type_User }, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
});

// --- Auto-generated hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useAuthMeQuery,
} = authApi;
