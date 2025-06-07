'use client';

import { ReactNode } from 'react';
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { store, RootState } from '@pexeso/lib/redux/store/store';
import AppInit from '@pexeso/components/_internal/AppInit';
import { GlobalStyle } from '@pexeso/components/StylingComp/GlobalStyle';
import { I18nextProvider } from 'react-i18next';
import i18n from '@pexeso/lib/i18n/i18n'; // path to configuration i18n
import { defaultTheme } from '@pexeso/components/StylingComp/themes/defaultTheme';
import { mediumTheme } from '@pexeso/components/StylingComp/themes/mediumTheme';
import { hardTheme } from '@pexeso/components/StylingComp/themes/hardTheme';

const themeMap = {
  defaultTheme,
  mediumTheme,
  hardTheme,
};

//solution from chatGPT

function InnerThemeProvider({ children }: { children: ReactNode }) {
  const { theme: currentThemeKey, isEnd } = useSelector(
    (state: RootState) => state.game
  );
  const currentTheme =
    themeMap[currentThemeKey as keyof typeof themeMap] ?? defaultTheme;

  const wrapperStyles = {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: isEnd ? 'center' : 'flex-start',
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GlobalStyle />
      <Box sx={wrapperStyles}>
        <AppInit />
        {children}
      </Box>
    </ThemeProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <InnerThemeProvider>{children}</InnerThemeProvider>
      </I18nextProvider>
    </ReduxProvider>
  );
}
