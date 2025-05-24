'use client';

import React from 'react';
import { Box } from '@mui/material';
import Link from 'next/link';
import styled from 'styled-components';

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

// ---------- styled components

export const StyledNextMainLink = styled(Link)`
  ${sharedNavLinkStyles};
  width: 50%;

  @media (max-width: 436px) {
    width: 100%;
    text-align: center;
    align-items: center;
  }
`;

// ---------- component

const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={sharedWrapperStyles}>
      <Box sx={sharedHeaderNavigation}>
        <Box sx={navStyles}>

          <StyledNextMainLink href="/about-game">O Hre</StyledNextMainLink>
          <StyledNextMainLink href="/settings"> Hraj hru</StyledNextMainLink>

        </Box>
      </Box>
      <Box sx={mainContentStyles}>
        {children}
      </Box>
    </Box>
  );
};

export default SharedLayout;
