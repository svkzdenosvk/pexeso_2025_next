'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preloadImages } from '@pexeso/_inc/data';
import { _graphqlRequest } from '@pexeso/graphql/graphqlClient';

import { IMAGES_QUERY } from '@pexeso/graphql/queries';
import { My_Type_Img_Name } from '@pexeso/_inc/my_types';
import { RootState } from '@pexeso/redux/store/store';
import {
  set_img_names,
  set_loading,
} from '@pexeso/redux/store/reducers/gameSlice';

export default function AppInit() {
  const dispatch = useDispatch();
  const { imgNames, isLoading } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    if (!isLoading) {
      return;
    } else {
      //axios fetching graphql
      const fetchApiGraphqlImages = async () => {
        const { data } = await _graphqlRequest(IMAGES_QUERY);

        let imgNamesArr: My_Type_Img_Name[] = data.images.map(
          (oneImgName: { name: My_Type_Img_Name }) => oneImgName.name
        );
        //set names to redux from API graphql
        dispatch(set_img_names(imgNamesArr));
      };

      fetchApiGraphqlImages();
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
