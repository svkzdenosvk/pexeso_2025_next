'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadImages } from '@pexeso/_inc/functions/gameRelated';
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';
import { RootState } from '@pexeso/lib/redux/store/store';
import { set_loading } from '@pexeso/lib/redux/store/reducers/gameSlice';
import { setUser, clearUser } from '@pexeso/lib/redux/store/reducers/authSlice';

/**
 * AppInit is a headless (UI-less) component used to initialize core app logic on mount.
 *
 * Features:
 * - Verifies if the client is logged in via secure API (`/api/auth/me`)
 * - Applies origin protection against unauthorized domains
 * - Preloads game assets (images) at startup
 *
 * @component
 * @example
 * <AppInit />
 *
 * @remarks
 * - This component has no visual output; it purely manages side effects.
 * - Runs on the client side only (`'use client'` directive).
 *
 * @dependencies
 * react, react-redux, @pexeso/lib, fetch API
 */

// ---------- Component

export default function AppInit() {
  const dispatch = useDispatch();
  const { imgNames, isLoading } = useSelector((state: RootState) => state.game);

  // Handle user authentication on first load
  // This is replacement for BE (for onAuthStateChanged on FE)
  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Protect against unknown client origins
        if (!verifyClientOrigin()) {
          console.error('Invalid origin detected');
          dispatch(clearUser());
          return;
        }

        // Call API to verify if user is authenticated (based on cookie/session)
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Send cookies with request
        });

        if (!res.ok) throw new Error('Not logged in');

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
          dispatch(clearUser());
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        dispatch(clearUser());
      }
    };

    checkLogin(); // Trigger login check on mount
  }, [dispatch]);

  // Preload game images only once when loading state is true
  useEffect(() => {
    if (!isLoading) return;

    preloadImages(imgNames)
      .then(() => {
        // Set loading to false when done
        dispatch(set_loading());
      })
      .catch(() => {
        console.warn('Not all images were loaded');
        window.location.reload();
      });
  }, [isLoading, imgNames, dispatch]);

  return null; // This component renders nothing
}
