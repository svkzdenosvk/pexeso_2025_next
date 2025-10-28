'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import type { AppDispatch } from '@pexeso/lib/redux/store/store';
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';
import { usePathname } from 'next/navigation';

/**
 * useAuthCheck Hook
 *
 * Purpose:
 * - Validates user authentication status on app initialization or route change.
 * - Calls `/api/auth/me` to verify or refresh JWT tokens (short/long term).
 * - Updates the Redux store based on authentication state.
 *
 * Workflow:
 * 1. Verify client origin (basic front-end CORS protection).
 * 2. Fetch `/api/auth/me` to validate session via cookies.
 * 3. If valid, store user data in Redux; otherwise, clear the user state.
 * 4. Runs automatically on route change or first load.
 */

export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // ---------- 1. Protect against unverified client origins
        if (!verifyClientOrigin()) {
          dispatch(clearUser());
          return;
        }

        // ---------- 2. Validate current session with backend API
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Send cookies with request
        });

        // ---------- 3. Handle invalid or expired session
        if (!res.ok) {
          dispatch(clearUser());
          return;
        }

        const data = await res.json();

        // ---------- 4. Update Redux store with authenticated user
        if (data?.isLoggedIn) {
          dispatch(
            setUser({
              id: data.id,
              name: data.name,
              email: data.email,
            })
          );
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        
        // ---------- 5. Handle unexpected errors (network or runtime)
        // console.error('Auth check failed:', err);
        dispatch(clearUser());
      }
    };

    checkLogin();
  }, [dispatch, pathname]);
};
