'use client';

import React from 'react';
import { Box } from '@mui/material';
import Link from 'next/link';
import styled from 'styled-components';

import { sharedNavLinkStyles } from '@pexeso/components/StylingComp/SharedStyles';

// ---------- sx styles

const sharedAboutWrapperStyles = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  minHeight: '70vh',
  '@media (max-width:600px)': {
    flexDirection: 'column',
  },
} as const;

const sharedAboutAsideNavigation = {
  display: 'flex',
  flexDirection: 'column',
  width: '30vw',
  minHeight: '70vh',
  '@media (max-width:600px)': {
    width: '100%',
    minHeight: 'auto',
  },
} as const;

const navStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '200px',
  mt: '100px',
  '@media (max-width:600px)': {
    mt: '20px',
    height: 'auto',
  },
} as const;

const mainContentAboutStyles = {
  p: 0,
  m: 0,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  minHeight: '70vh',
  width: '70vw',
  fontSize: '20px',
  '@media (max-width:600px)': {
    width: '100%',
  },
} as const;

// ---------- styled components
export const StyledNextAboutLink = styled(Link)`
   ${sharedNavLinkStyles};
   margin: 10px 0;
`;

// ---------- component

const SharedAboutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={sharedAboutWrapperStyles}>
      <Box sx={sharedAboutAsideNavigation}>
        <Box component="nav" sx={navStyles}>
        
          <StyledNextAboutLink href="/about-game/rules">Pravidlá</StyledNextAboutLink>
          <StyledNextAboutLink href="/about-game/images">Obrázky</StyledNextAboutLink>

        </Box>
      </Box>

      <Box sx={mainContentAboutStyles}>
        {children}
      </Box>
    </Box>
  );
};

export default SharedAboutLayout;
