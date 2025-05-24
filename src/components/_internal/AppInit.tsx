'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnlyImgNames, preloadImages } from '@pexeso/_inc/data';
import { RootState } from '@pexeso/redux/store/store';
import { set_img_names, set_loading } from '@pexeso/redux/store/reducers/gameSlice';

export default function AppInit() {
  const dispatch = useDispatch();
  const { imgNames, isLoading } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    const fetchImgNamesFunc = async () => {
      try {
        const fetchedImgNames = await fetchOnlyImgNames();
        dispatch(set_img_names(fetchedImgNames));
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };

    fetchImgNamesFunc();
  }, [dispatch]);

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

  return null; // no UI
}
