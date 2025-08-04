import { createTheme } from '@mui/material/styles';
import {sharedThemeStyles} from '@pexeso/components/StylingComp/SharedStyles'

/**
 * Hard MUI Theme configuration
 *
 * This theme is applied for the "hard" difficulty level.
 * It uses dark mode colors with a black background and white text.
 * Includes shared MUI theme overrides and custom class-specific styles.
 *
 * @see sharedThemeStyles - Shared MUI style overrides
 */

// Hard theme (used for "hard" game level)
export const hardTheme = createTheme({
    palette: {
        mode: 'dark',
        text:{ primary:'#ffffff'},
        background: { default: 'black' },       
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: 'black',          
            },
            '.clorTextTheme':{
              color: 'white !important',   
            },
          },
        },
      },
    ...sharedThemeStyles
    
});