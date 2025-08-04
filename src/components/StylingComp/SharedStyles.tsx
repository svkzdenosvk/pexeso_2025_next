'use client';

/**
 * SharedStyles
 *
 * Contains shared animation and style definitions used across the Pexeso app.
 * Includes:
 * - Pulsating animation for CTA buttons
 * - Reusable styles for navigation buttons
 * - Shared typography setup for MUI themes
 *
 * @library @mui/system, @mui/material
 * @usage Imported in theme files and components like layout, buttons, links
 */

// Pulsating button animation
import { keyframes } from '@mui/system';

export const pulseShadow = keyframes`
  0% { box-shadow: 0 2px 0px white; }
  50% { box-shadow: 0 6px 10px goldenrod; }
  100% { box-shadow: 0 2px 0px white; }
`;

export const pulsatingButtonStyles = {
  textAlign: 'center',
  textDecoration: 'none',
  width: '50%',
  border: 'none',
  background: 'transparent',
  color: 'black',
  margin: '10px auto',
  fontWeight: 'bold',
  padding: '10px 25px',
  display: 'inline',
  borderRadius: '25px',
  animation: `${pulseShadow} 1.5s infinite ease-in-out`,
  '&:hover': {
    color: 'goldenrod',
    transition: 'color 0.3s ease',
    boxShadow: '0px 7px 10px grey',
  },
};

// Navigation link styles
export const sharedNavLinkStyles = {
  textAlign: 'center',
  padding: '20px',
  color: 'white',
  backgroundColor: '#808080',
  fontSize: '20px',
  fontWeight: 'bold',
  textDecoration: 'none',
  outline: 'none',
  boxShadow: 'none',
  border: 'none',
  transition:
    'color 0.3s ease, background-color 0.3s ease, transform 0.3s ease',

  '&:hover': {
    color: 'goldenrod',
    backgroundColor: '#696969',
    textDecoration: 'none',
    outline: 'none',
    border: 'none',
    boxShadow: '0px 4px 8px rgba(255, 165, 0, 0.3)',
  },
} as const;

//-----------------------------------------------------------------------------------------

// Shared theme typography styles
export const sharedThemeStyles = {
  typography: {
    h1: {
      fontFamily: '"Times New Roman", serif',
      textAlign: 'center' as const,
      fontSize: 'calc(2rem + 5vw)',
    },
    h2: {
      fontFamily: '"Times New Roman", serif',
      textAlign: 'center' as const,
    },
    h3: {
      fontFamily: '"Times New Roman", serif',
      textAlign: 'center' as const,
    },
    h4: {
      fontFamily: '"Times New Roman", serif',
      // textAlign: "center" as const,          //h4 in rules component not need to align left
    },
    h5: {
      fontFamily: '"Times New Roman", serif',
      textAlign: 'center' as const,
    },
    h6: {
      fontFamily: '"Times New Roman", serif',
      textAlign: 'center' as const,
    },
  },
};
