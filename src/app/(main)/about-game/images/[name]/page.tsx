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
import NextLinkComposed from '@pexeso/components/SharedComponents/NextLinkComposed';
import ReusableImageBox from '@pexeso/components/SharedComponents/ReusableImageBox';

// ---------- Sx styles

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
 * Component for displaying a single image based on the URL parameter.
 * - Uses Next.js dynamic routing via `useParams()` to get image name
 * - Validates the image name against Redux store using a type guard function
 * - If image exists, displays it along with localized title and back button
 * - If image does not exist, shows an error message and a back button
 *
 * @component
 * @route /about-game/images/[name]
 * @client
 * @dependencies React, Next.js, Redux, i18next, MUI
 */
const SingleImagePage = () => {
  const { t } = useTranslation(); // i18n translation hook

  // Get image name from dynamic route param
  const params = useParams();
  const name = typeof params?.name === 'string' ? params.name : undefined;

  // Get list of valid image names from Redux store
  const { imgNames } = useSelector((state: RootState) => state.game);

  // State for error handling and display alert
  const [errorImgName, setErrorImgName] = useState(false);
  const [imgNameH3, setNameH3] = useState('');

  // Validate image name and set display name or error
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
      // If no error
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
        {/* Error case: image not found */}
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
          //  Success case: valid image
          <>
          {/* Solving problem with potential undefined name  */}
            {!errorImgName && name && (
              <ReusableImageBox sx={imgStyles} imageName={name} />
            )}

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
