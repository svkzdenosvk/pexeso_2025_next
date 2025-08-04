import { createTheme } from '@mui/material/styles';

import { sharedThemeStyles } from '@pexeso/components/StylingComp/SharedStyles';

/**
 * Medium MUI Theme configuration
 *
 * This theme is applied for the "medium" difficulty level.
 * It uses a dark mode color scheme with a deep burgundy background and white text.
 * Includes shared MUI theme overrides.
 *
 * @see sharedThemeStyles - Shared MUI style overrides
 */

// Medium theme (used for "medium" game level)
export const mediumTheme = createTheme({
  palette: {
    mode: 'dark',
    text: { primary: '#ffffff' },
    background: { default: '#4d141d' }, // tiež môžeš nastaviť paletu
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#4d141d', // pozadie tela
        },
      },
    },
  },
  ...sharedThemeStyles,
});
