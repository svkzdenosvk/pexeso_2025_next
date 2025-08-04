'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RootState } from '@pexeso/lib/redux/store/store';
import Image from 'next/image';
import { my_Type_Guard_function } from '@pexeso/_inc/_inc_functions';
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';

// ---------- sx styles

const singleImgContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: '70vh',
} as const;

const singleImgMainContentStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
} as const;

const imgStyles = {
  width: '200px',
  height: '200px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 2,
} as const;

// Single image page component
const SingleImagePage = () => {
  const { t } = useTranslation(); // i18n translation hook

  // Get image name from URL params
  const params = useParams();
  const name = typeof params?.name === 'string' ? params.name : undefined;

  // Get all image names from Redux store
  const { imgNames } = useSelector((state: RootState) => state.game);

  // State for error handling and display alert
  const [errorImgName, setErrorImgName] = useState(false);
  const [imgNameH3, setNameH3] = useState('');

  //error if img doesn´t exist
  useEffect(() => {
    if (!name || typeof name !== 'string') {
      setErrorImgName(true);
      setNameH3(t('single_img_page.h2.not_exist'));
      return;
    }

    if (!my_Type_Guard_function(name, imgNames)) {
      setErrorImgName(true);
      setNameH3(t('single_img_page.h2.not_exist'));
    } else {
      // if not error set H3 from param (name of picture)
      setErrorImgName(false);
      let displayName: string = name;

      setNameH3(t(`single_img_page.h2.${displayName}`));
    }
  }, [name, imgNames]);

  return (
    <Box sx={singleImgContentStyles}>
      {/* Page title with capitalized first letter */}
      <Typography variant="h3" component="h3">
        {imgNameH3.charAt(0).toUpperCase() + imgNameH3.slice(1)}
      </Typography>
      <Box sx={singleImgMainContentStyles}>
        {/* if error state - image not found */}
        {errorImgName ? (
          <>
            <Typography variant="h3" component="h3">
              {t('single_img_page.h3_error')}
            </Typography>
            <Button
              component={NextLinkComposed}
              to="/about-game/images"
              variant="contained"
              sx={pulsatingButtonStyles} // animated button style
            >
              {t('single_img_page.btn.btn_error')}
            </Button>
          </>
        ) : (
          //  else valid image state
          <>
            <Box sx={imgStyles}>
              <Image
                src={`/pictures/pexeso/${name}.jpg`}
                alt={`Obrázok ${name}`}
                fill
                style={{ objectFit: 'cover' }} // this is neededbecause of "fill"
              />
            </Box>

            <Button
              component={NextLinkComposed}
              to="/about-game/images"
              variant="contained"
              sx={pulsatingButtonStyles} // animated button style
            >
              {t('single_img_page.btn.btn_back')}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SingleImagePage;
