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

// ---------- component

const SingleImagePage = () => {
  const { t } = useTranslation();

  const params = useParams();
  const name = typeof params?.name === 'string' ? params.name : undefined;

  const { imgNames } = useSelector((state: RootState) => state.game);

  const [errorImgName, setErrorImgName] = useState(false);
  const [imgNameH1, setNameH1] = useState('');

  useEffect(() => {
    if (!name || typeof name !== 'string') {
      setErrorImgName(true);
      setNameH1('Neexistujúci obrázok');
      return;
    }

    if (!my_Type_Guard_function(name, imgNames)) {
      setErrorImgName(true);
      setNameH1('Neexistujúci obrázok');
    } else {
      setErrorImgName(false);
      let displayName: string = name;

      // exceptions
      if (name === 'vesmir') displayName = 'vesmír';
      if (name === 'vibracia') displayName = 'vibrácia';

      setNameH1(displayName);
    }
  }, [name, imgNames]);

  return (
    <Box sx={singleImgContentStyles}>
      <Typography variant="h3" component="h3">
        {imgNameH1.charAt(0).toUpperCase() + imgNameH1.slice(1)}
      </Typography>

      <Box sx={singleImgMainContentStyles}>
        {errorImgName ? (
          <>
            <Typography variant="h3" component="h3">
              {t('single_img_page.h3_error')}
            </Typography>
            <Button
              component={NextLinkComposed}
              to="/about-game/images"
              variant="contained"
              sx={pulsatingButtonStyles}
            >
              {t('single_img_page.btn_error')}
            </Button>
          </>
        ) : (
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
              sx={pulsatingButtonStyles}
            >
              {t('single_img_page.btn_back')}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SingleImagePage;
