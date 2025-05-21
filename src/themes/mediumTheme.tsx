import { createTheme } from '@mui/material/styles';

import {sharedThemeStyles} from '@pexeso/components/StylingComp/SharedStyles'

//medium theme is for level medium
export const mediumTheme = createTheme({
    palette: {
        mode: 'dark',
        text:{ primary:'#ffffff'},
        background: { default: '#4d141d' },       // tiež môžeš nastaviť paletu
      },
    components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: '#4d141d',          // pozadie tela
            },
          },
        },
      },
    ...sharedThemeStyles
    
});