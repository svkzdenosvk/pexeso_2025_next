'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';

import { sharedNavLinkStyles } from '@pexeso/components/StylingComp/SharedStyles';

// ---------- sx styles

const sharedWrapperStyles = {
  p: 0,
  m: 0,
  boxSizing: 'border-box',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
} as const;

const sharedHeaderNavigation = {
  height: '30vh',
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
  return (
    <Box sx={sharedWrapperStyles}>
      <Box sx={sharedHeaderNavigation}>
        <Box sx={navStyles}>
          <Button
            component={NextLinkComposed}
            to="/about-game"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            O Hre
          </Button>
          <Button
            component={NextLinkComposed}
            to="/settings"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            Hraj
          </Button>
        </Box>
      </Box>
      <Box sx={mainContentStyles}>{children}</Box>
    </Box>
  );
};

export default SharedLayout;
