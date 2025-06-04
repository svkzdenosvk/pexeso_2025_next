'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { My_Type_Img_Name, My_Type_Api_Data } from '@pexeso/_inc/my_types';
import { RootState } from '@pexeso/redux/store/store';
import {
  set_img_names,
  set_loading,
} from '@pexeso/redux/store/reducers/gameSlice';
import { preloadImages } from '@pexeso/_inc/data';
import { _axiosClient } from '@pexeso/_inc/_inc_functions';

// ---------- component
export default function AppInit() {
  const dispatch = useDispatch();
  const { imgNames, isLoading } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    if (!isLoading) {
      return;
    } else {

      //axios fetching 
      const fetchImages = async () => {
        try {
          const res = await _axiosClient.get<My_Type_Api_Data[]>('/images');
           let imgNamesArr: My_Type_Img_Name[] = res.data.map(
            (oneImgName: { name: My_Type_Img_Name }) => oneImgName.name
          );

          //set names to redux from API axios
           dispatch(set_img_names(imgNamesArr));
        } catch (error) {
          console.error('Chyba pri načítaní obrázkov:', error);
        }
      };

      fetchImages();
    }
  }, [dispatch]);

  //preloading pictures
  useEffect(() => {
    if (!isLoading || imgNames.length === 0) return;

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
