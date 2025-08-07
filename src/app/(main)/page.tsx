'use client';
import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Home Page Component
 *
 * This is the default landing page of the application.
 * It displays a localized heading in a centered layout.
 *
 * Features:
 * - Uses i18n for multilingual support
 * - Applies MUI styling via `sx` prop
 * - Centered layout with serif-styled heading
 *
 * @component
 * @route /
 * @client
 * @dependencies React, MUI, i18next
 */

// ---------- Sx styles

const divStyles = {
  m: 'auto',
  minHeight: '70vh',
} as const;

const h1Styles = {
  fontWeight: 'bold',
  fontFamily: '"Times New Roman", serif',
} as const;

// ---------- component

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box sx={divStyles}>
      {/* Translated headline text */}
      <Typography variant="h1" component="h1" sx={h1Styles}>
        {t('home_page.h1')}
      </Typography>
    </Box>
  );
};

export default Home;
