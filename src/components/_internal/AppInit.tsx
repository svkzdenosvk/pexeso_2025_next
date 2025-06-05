'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';
import { IMAGES_QUERY } from '@pexeso/graphql/queries';
import { preloadImages } from '@pexeso/_inc/data';
import { _graphqlFetcher } from '@pexeso/_inc/_inc_functions'; //better for stable reference ->important for SWR cache

import { My_Type_Api_Data, My_Type_Img_Name } from '@pexeso/_inc/my_types';
import { RootState } from '@pexeso/redux/store/store';
import {
  set_img_names,
  set_loading,
} from '@pexeso/redux/store/reducers/gameSlice';

export default function AppInit() {
  const dispatch = useDispatch();
  const { imgNames, isLoading } = useSelector((state: RootState) => state.game);

  //swr
  const {
    data,
    error: errorSWR, //errorSWR is alias for error
    isLoading: isLoadingSWR, //isLoadingSWR is alias for isLoading
  } = useSWR<My_Type_Api_Data>(IMAGES_QUERY, _graphqlFetcher);

  //set fetched img names from graphql to redux
  useEffect(() => {
    if (!isLoading || !data || errorSWR) {
      return;
    } else {
      let imgNamesArr: My_Type_Img_Name[] = data.images.map(
        (oneImgName: { name: My_Type_Img_Name }) => oneImgName.name
      );
      dispatch(set_img_names(imgNamesArr));
    }
  }, [isLoading, errorSWR, data, dispatch]);

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
