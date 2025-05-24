import { createTheme } from '@mui/material/styles';

import {sharedThemeStyles} from '@pexeso/components/StylingComp/SharedStyles'

//hard theme is for level hard
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