'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import NextLinkComposed from '@pexeso/components/SharedComponents/NextLinkComposed';
import { sharedNavLinkStyles } from '@pexeso/components/StylingComp/SharedStyles';

// ---------- Sx styles

// Wrapper layout for the entire About section
const sharedAboutWrapperStyles = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  // minHeight: '70vh',
  minHeight: '70%',

  // Responsive: stack items vertically on smaller screens
  '@media (max-width:600px)': {
    flexDirection: 'column',
  },
} as const;

// Sidebar (left navigation column) for the About section
const sharedAboutAsideNavigation = {
  display: 'flex',
  flexDirection: 'column',
  width: '30vw',
  // minHeight: '70vh',
  minHeight: '70%',

  // Full width on mobile
  '@media (max-width:600px)': {
    width: '100%',
    minHeight: 'auto',
  },
} as const;

// Container for navigation buttons
const navStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '200px',
  mt: '100px',

  // Adjust spacing on mobile
  '@media (max-width:600px)': {
    mt: '20px',
    height: 'auto',
  },
} as const;

// Main content area (right side)
const mainContentAboutStyles = {
  p: 0,
  m: 0,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  // minHeight: '70vh',
  height: '70%',
  width: '70vw',
  fontSize: '20px',

  // Full width on mobile
  '@media (max-width:600px)': {
    width: '100%',
  },
} as const;

// Spacing for navigation links
const navLinkStyles = {
  margin: '10px 0px;',
} as const;

/**
 * SharedAboutLayout
 *
 * Third-level layout wrapper for nested `/about-game/*` pages.
 * - Splits screen into a left navigation sidebar and right content panel
 * - Provides navigation links to About subsections (e.g., rules, images)
 * - Uses responsive design to adapt to mobile screens
 *
 * @component
 * @layout
 * @client
 * @dependencies React, MUI, i18next, NextLinkComposed
 * @example
 * Used in nested routes like `/about-game/rules/page.tsx` or `/about-game/images/page.tsx`
 */

// ---------- component

const SharedAboutLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <Box sx={sharedAboutWrapperStyles}>
      {/* Sidebar Navigation Panel */}
      <Box sx={sharedAboutAsideNavigation}>
        <Box component="nav" sx={navStyles}>
          {/* Link to Rules Subpage */}
          <Button
            component={NextLinkComposed}
            to="/about-game/rules"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t('shared_about_nav.rules_link')}
          </Button>

          {/* Link to Images Subpage */}
          <Button
            component={NextLinkComposed}
            to="/about-game/images"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t('shared_about_nav.images_link')}
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={mainContentAboutStyles}>{children}</Box>
    </Box>
  );
};

export default SharedAboutLayout;
