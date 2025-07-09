'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadImages } from '@pexeso/_inc/data';
import { RootState } from '@pexeso/lib/redux/store/store';
import { set_loading } from '@pexeso/lib/redux/store/reducers/gameSlice';
import { setUser, clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";

export default function AppInit() {
  const dispatch = useDispatch();
  const { imgNames, isLoading } = useSelector((state: RootState) => state.game);

   // this is replacement for BE for onAuthStateChanged on FE
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // cookies must be sent
        });

        if (!res.ok) throw new Error('Not logged in');

        const data = await res.json();

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

    checkLogin();
  }, [dispatch]);

  //preloading images
  useEffect(() => {
    if (!isLoading) return;

    preloadImages(imgNames)
      .then(() => {
        dispatch(set_loading());
      })
      .catch(() => {
        console.warn('Not all images were loaded');
        window.location.reload();
      });
  }, [isLoading, imgNames, dispatch]);

  return null; 
}
