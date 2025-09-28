'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';
import { setUser, clearUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import type { AppDispatch } from '@pexeso/lib/redux/store/store';
import { useAuthMeQuery } from '@pexeso/lib/redux/services/authApi';

/**
 * useAuthCheck Hook
 *
 * Purpose:
 * Runs an authentication check during application initialization or page refresh.
 * This replaces Firebase's `onAuthStateChanged` with a solution based on
 * a custom API endpoint (`/api/auth/me`) and HTTP-only cookies.
 *
 * Execution flow:
 * 1. Calls the `auth/me` endpoint automatically using RTK Query (`useAuthMeQuery`).
 * 2. Verifies the client origin before processing the result.
 * 3. Validates the API response structure and ensures required fields are present.
 * 4. Updates the Redux store with user data on success or clears the user state on failure.
 *
 * @hook
 * @returns void (only performs side effects)
 *
 * @dependencies
 * - Redux store (`setUser`, `clearUser`)
 * - RTK Query service (`useAuthMeQuery`)
 * - Custom origin validation (`verifyClientOrigin`)
 */
export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Automatically calls /api/auth/me and provides query state and response data
  const { data, error, isLoading } = useAuthMeQuery();

  useEffect(() => {
    // --- Step 1: Wait until the request is finished
    if (isLoading) return; // during waiting for data

    // --- Step 2: Verify origin before processing any response data
    if (!verifyClientOrigin()) {
      console.error('Invalid origin detected');
      dispatch(clearUser());
      return;
    }

    // --- Step 3: Validate the backend response before updating the state
    const isValid =
      data?.isLoggedIn === true &&
      typeof data?.user === 'object' &&
      data?.user !== null &&
      typeof data?.user?.uid === 'string' &&
      data.user.uid.trim().length > 0 &&
      typeof data?.user.email === 'string' &&
      data.user.email.trim().length > 0 &&
      typeof data?.user.name === 'string' &&
      data.user.name.trim().length > 0;

    // --- Step 4: Update Redux store based on validation ---
    if (isValid) {
      dispatch(
        setUser({...data.user!}));
    } else {
      // Response did not meet validation criteria → clear user state
      console.warn('Auth response failed validation:', data);
      dispatch(clearUser());
    }

    // Handle network or server errors
    if (error) {
      console.error('Auth check failed:', error);
      dispatch(clearUser());
    }
  }, [data, error, isLoading, dispatch]);
};
