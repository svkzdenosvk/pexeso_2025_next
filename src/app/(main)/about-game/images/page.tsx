'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@pexeso/lib/redux/store/store';
import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';
import MySuspense from '@pexeso/components/_internal/MySuspense';

// ---------- sx styles

const imgContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
} as const;

const imgMainContentStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  gap: '1%',
};

const btnLinkStyles = {
  mb: 2,
  p: 0,
  backgroundColor: 'white',
  textDecoration: 'none',
  outline: 'none',
  boxShadow: 'none',
  border: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
} as const;

//individual img styles
const imgStyles = {
  width: 200,
  height: 200,
  borderRadius: 2,
  overflow: 'hidden',
  position: 'relative',

  transition: 'box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0px 0px 28px 19px goldenrod',
  },
} as const;

// Wrapper component with Suspense comp
export default function ImagesWrapper() {
  const { t } = useTranslation();

  return (
    //  wrap Images with Suspense during loading state
    <MySuspense loadingText="loading_alerts.images">
      <Images />
    </MySuspense>
  );
}

// Main image gallery component
const Images = () => {
  // Translation hook
  const { t } = useTranslation();

  // Get image names from Redux store
  const { imgNames } = useSelector((state: RootState) => state.game);

  return (
    <Box sx={imgContentStyles}>
      {/* Page title */}
      <Typography variant="h2" component="h2">
        {t('images_page.h2')}
      </Typography>

      {/* Image grid container */}
      <Box sx={imgMainContentStyles}>
        {/* { imgNames.length === 0 ? (
          <Typography variant="h4" component="h4">
            {t('loading_alerts.images')}
          </Typography>
        ) : ( */}

        {/* Render each image as clickable link */}
        {
          imgNames.map((oneImgName) => (
            <Button
              component={NextLinkComposed}
              key={oneImgName}
              to={`/about-game/images/${oneImgName}`}
              sx={btnLinkStyles}
            >
              {/* Image container */}
              <Box sx={imgStyles}>

                {/* Optimized Next.js image */}
                <Image
                  src={`/pictures/pexeso/${oneImgName}.jpg`}
                  alt={`Obrázok ${oneImgName}`}
                  fill
                  style={{ objectFit: 'cover' }} // this is needed because of "fill"
                />
              </Box>
            </Button>
          ))
          // )}
        }
      </Box>
    </Box>
  );
};
