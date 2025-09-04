// hooks/useAuthCheck.ts
'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';
import { setUser, clearUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import type { AppDispatch } from '@pexeso/lib/redux/store/store';

/**
 * useAuthCheck Hook
 *
 * Verifies user authentication on app initialization.
 * Replaces Firebase `onAuthStateChanged` with a custom API + cookie based check.
 *
 * @hook
 * @returns void (side effects only)
 *
 * @dependencies
 * - Redux (dispatch for `setUser`, `clearUser`)
 * - Custom utils (`verifyClientOrigin`)
 * - API endpoint `/api/auth/me`
 *
 * @remarks
 * - Rejects requests from unverified client origins.
 * - Clears user if no token is found or API validation fails.
 * - On success, stores authenticated user info in Redux.
 */
export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {

    const checkLogin = async () => {
      try {

        // Protect against unknown client origins
        if (!verifyClientOrigin()) {
          console.error('Invalid origin detected');
          dispatch(clearUser());
          return;
        }

        // Validate session with backend
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Send cookies with request
        });

        if (!res.ok) {
          console.warn('API auth check failed, status:', res.status);
          throw new Error('Not logged in');
        }

        const data = await res.json();

        // If user is authenticated, store their data in Redux
        if (data?.isLoggedIn) {
          dispatch(
            setUser({
              uid: data.uid,
              name: data.name,
              email: data.email,
            })
          );

        } else {

          // API responded but no valid session
          dispatch(clearUser());
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        dispatch(clearUser());
      }
    };

    // Run check once on mount
    checkLogin(); 
  }, [dispatch]);
};
