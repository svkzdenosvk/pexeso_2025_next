'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@pexeso/lib/redux/store/store';
import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NextLinkComposed from '@pexeso/components/SharedComponents/NextLinkComposed';
import ReusableImageBox from '@pexeso/components/SharedComponents/ReusableImageBox';
import MySuspense from '@pexeso/components/_internal/MySuspense';

// ---------- Sx styles

// Main container for the gallery page
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

// Styles for the image link buttons
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

// Individual img styles with hover effect
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

/**
 * ImagesWrapper
 *
 * Wrapper component for the image gallery.
 * Wraps the <Images /> component with a loading fallback using `MySuspense`
 *
 * @component
 * @route /about-game/images
 * @client
 * @dependencies React, MUI, Redux, Next.js, i18next
 */
export default function ImagesWrapper() {
  const { t } = useTranslation();

  return (
    <MySuspense loadingText="loading_alerts.images">
      <Images />
    </MySuspense>
  );
}

/**
 * Images
 *
 * Main image gallery component that:
 * - Retrieves image names from Redux store
 * - Displays a responsive grid of images
 * - Wraps each image in a link to its detailed page
 * - Uses Next.js <Image> for optimized image rendering
 *
 * @component
 * @client
 * @dependencies React, Redux, MUI, i18next, Next.js
 */

const Images = () => {
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
              {/* Individual image box */}
              * <ReusableImageBox sx={imgStyles} imageName={oneImgName} />
            </Button>
          ))
          // )}
        }
      </Box>
    </Box>
  );
};

