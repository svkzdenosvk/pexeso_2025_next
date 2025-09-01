'use client';

import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';
import NextLinkComposed from '@pexeso/components/SharedComponents/NextLinkComposed';
import ReusableImageBox from '@pexeso/components/SharedComponents/ReusableImageBox';
import { useImgValidation } from '@pexeso/_inc/hooks/UseImgValidation';

// ---------- Sx styles

// Container for the whole single image page
const singleImgContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  // height: '70vh',
  height: '60vh',
} as const;

// Main content area for image and button
const singleImgMainContentStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
} as const;

// Individual image box
const imgStyles = {
  width: '200px',
  height: '200px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 2,
} as const;

/**
 * SingleImagePage
 *
 * Page for displaying a single image detail.
 * - Validates image name from the route param using `useImgValidation`
 * - Shows either an error message + back button or the image + back button
 * - Localized text via i18next
 *
 * @component
 * @route /about-game/images/[name]
 * @client
 * @dependencies React, Next.js, Redux, i18next, MUI
 */
const SingleImagePage = () => {
  const { t } = useTranslation(); // i18n translation hook

  // Validate image name and set display name or error
   const { errorImgName, imgNameH3, imageName } = useImgValidation();

  return (
    <Box sx={singleImgContentStyles}>
      {/* Page title with capitalized first letter */}
      <Typography variant="h3" component="h3">
        {imgNameH3.charAt(0).toUpperCase() + imgNameH3.slice(1)}
      </Typography>
      <Box sx={singleImgMainContentStyles}>
        {/* Error case: image not found */}
        {errorImgName ? (
          <>
            {/* Error message if image is not found */}
            <Typography variant="h3" component="h3">
              {t('single_img_page.h3_error')}
            </Typography>

            {/* Button to go back to images page */}
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
          //  Success case: valid image
          <>
            {/* Display the image */}
            {!errorImgName && imageName && (
              <ReusableImageBox sx={imgStyles} imageName={`pexeso/${imageName}`} />
            )}
            
            {/* Button to go back to images page */}
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
