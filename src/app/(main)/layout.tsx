'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';
import { sharedNavLinkStyles } from '@pexeso/components/StylingComp/SharedStyles';
import TranslateButton from '@pexeso/components/SharedNextElements/TranslateButton';

/**
 * SharedLayout Component
 *
 * Second -level layout wrapper for the app, providing:
 * - Language switcher
 * - Responsive navigation with buttons linking to different pages
 * - Consistent structure across all pages
 *
 * Features:
 * - Responsive navigation bar (mobile-friendly)
 * - Custom Next.js-compatible links via `NextLinkComposed`
 * - Multilingual support with i18next
 * - Clean layout using MUI's `Box` and `Button` components
 *
 * @component
 * @layout
 * @client
 * @dependencies React, MUI, i18next, NextLinkComposed
 */

// ---------- sx styles

const sharedWrapperStyles = {
  p: 0,
  m: 0,
  boxSizing: 'border-box',
  // minHeight: '100vh',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
} as const;

const sharedHeaderNavigation = {
  // height: '30vh',
  height: '30%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
} as const;

const navStyles = {
  display: 'flex',
  width: '100%',
  backgroundColor: '#808080',
  '@media (max-width:436px)': {
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
  },
} as const;

const mainContentStyles = {
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100%',
  width: '100%',
  '@media (max-width:600px)': {
    flexDirection: 'column',
  },
} as const;

const navLinkStyles = {
  width: '50%',

  '@media (max-width: 436px)': {
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
  },
} as const;

// ---------- component

const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <Box sx={sharedWrapperStyles}>
      {/* Language switcher */}
      <TranslateButton />

      {/* Header navigation section with two main links */}
      <Box sx={sharedHeaderNavigation}>
        <Box sx={navStyles}>
          {/* Link to the "About Game" page */}
          <Button
            component={NextLinkComposed}
            to="/about-game"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t('shared_main_nav.about_link')}
          </Button>

          {/* Link to the "Game Settings" page */}
          <Button
            component={NextLinkComposed}
            to="/settings"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t('shared_main_nav.game_link')}
          </Button>
        </Box>
      </Box>

      {/* Main content area – renders children components or pages */}
      <Box sx={mainContentStyles}>{children}</Box>
    </Box>
  );
};

export default SharedLayout;
