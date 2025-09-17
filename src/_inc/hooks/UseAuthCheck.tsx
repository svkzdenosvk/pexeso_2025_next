'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import type { AppDispatch } from '@pexeso/lib/redux/store/store';
import { authAction } from '@pexeso/app/actions/authAction';
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';

/**
 * useAuthCheck Hook
 *
 * Handles user authentication check on app initialization:
 * - Validates request origin (basic client-side protection).
 * - Calls `authAction` server action to check current session.
 * - On success → sets authenticated user in Redux.
 * - On failure → clears user state.
 *
 * @hook
 * @returns {void} (side effects only, no direct return value)
 *
 * @dependencies
 * - Redux (`dispatch`, `authSlice` actions)
 * - Server action (`authAction`)
 * - Utility (`verifyClientOrigin`)
 *
 * @remarks
 * - Runs once on mount.
 * - Rejects unknown client origins early.
 * - Validates server response strictly (non-empty uid, email, name).
 * - Falls back to clearing user on any failure.
 */
export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // --- Step 1: Protect against unknown client origins ---
        if (!verifyClientOrigin()) {
          console.error('Invalid origin detected');
          dispatch(clearUser());
          return;
        }

        // --- Step 2: Validate session with server action ---
        const data = await authAction();

        // --- Step 3: Strict response validation ---
        const isValid =
          data.isLoggedIn === true &&
          typeof data.uid === 'string' &&
          data.uid.trim().length > 0 &&
          typeof data.email === 'string' &&
          data.email.trim().length > 0 &&
          typeof data.name === 'string' &&
          data.name.trim().length > 0;

        // --- Step 4: Update Redux store based on validation ---
        if (isValid) {
          dispatch(
            setUser({
              uid: data.uid,
              name: data.name!,
              email: data.email!,
            })
          );
        } else {
          // --- Not valid session
          console.warn('Auth response failed validation:');
          dispatch(clearUser());
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        dispatch(clearUser());
      }
    };

    // --- Run check once on mount
    checkLogin();
  }, [dispatch]);
};
