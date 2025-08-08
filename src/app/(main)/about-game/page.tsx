'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';

/**
 * AboutGame Page
 *
 * Displays general information about the game, including title and visuals.
 *
 * Features:
 * - Localized content using i18next
 * - Styled heading using MUI Typography
 * - Responsive layout using MUI Box
 *
 * @component
 * @client
 * @dependencies React, MUI, i18next
 *
 * @remarks
 * This page is rendered under the `/about-game` route and is nested inside `SharedLayout`.
 *
 * @example
 * Route: `app/about-game/page.tsx`
 */

// ---------- component

const AboutGame = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mx: 'auto' }}>
      {/* Translated headline text */}
      <Typography variant="h2" component="h2">
        {' '}
        {t('about_page.h2')}
      </Typography>

      {/* Decorative or illustrative image section (styled via CSS) */}
      {/* <div className="img"></div> */}
    </Box>
  );
};

export default AboutGame;
