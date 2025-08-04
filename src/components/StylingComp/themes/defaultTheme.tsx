import { createTheme } from '@mui/material/styles';

import {sharedThemeStyles} from '@pexeso/components/StylingComp/SharedStyles'

/**
 * Default MUI Theme configuration
 *
 * This theme is used for the "easy" level and acts as the default visual style.
 * It defines a light mode color palette and includes shared theme styles.
 *
 * @see sharedThemeStyles - Shared MUI style overrides
 */

// Default theme (used also for "easy" level)
export const defaultTheme = createTheme({
    palette: {
        mode: 'light',
        text:{ primary:'#000000'},
        background: { default: '#ffffff' },       
      },
    components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: '#ffffff',          
            },
          },
        },
      },
    ...sharedThemeStyles
    
});