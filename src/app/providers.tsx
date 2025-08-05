'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { store, RootState } from '@pexeso/lib/redux/store/store';
import AppInit from '@pexeso/components/_internal/AppInit';
import { GlobalStyle } from '@pexeso/components/StylingComp/GlobalStyle';
import { I18nextProvider } from 'react-i18next';
import i18n from '@pexeso/lib/i18n/i18n'; // path to configuration i18n
import { defaultTheme } from '@pexeso/components/StylingComp/themes/defaultTheme';
import { mediumTheme } from '@pexeso/components/StylingComp/themes/mediumTheme';
import { hardTheme } from '@pexeso/components/StylingComp/themes/hardTheme';

/**
 * Global Providers wrapper that initializes Redux, i18n and dynamic theming for the app.
 *
 * Features:
 * - Injects Redux store to all components
 * - Provides language translations via react-i18next
 * - Applies dynamic Material-UI theme based on game difficulty
 * - Loads AppInit for preloading assets and session check
 *
 * @component
 * @example
 * <Providers><App /></Providers>
 *
 * @remarks
 * Use this as a root-level wrapper (e.g. in layout.tsx or _app.tsx)
 *
 * @dependencies
 * react-redux, i18next, MUI, internal Redux store & theme configs
 */

// ---------- Component

/**
 * Providers is the main entry point for global context/state providers.
 * It wraps the application with Redux, i18n, and theming context.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <InnerThemeProvider>{children}</InnerThemeProvider>
      </I18nextProvider>
    </ReduxProvider>
  );
}

// Mapping of available themes based on game difficulty
const themeMap = {
  defaultTheme,
  mediumTheme,
  hardTheme,
};

// ---------- Component
/**
 * InnerThemeProvider handles dynamic theming and layout structure
 * - Determines the current theme from Redux state
 * - Centers layout if game is finished (isEnd === true)
 */
function InnerThemeProvider({ children }: { children: ReactNode }) {
  const { theme: currentThemeKey, isEnd } = useSelector(
    (state: RootState) => state.game
  );

  // Determine active theme or fall back to default
  const currentTheme =
    themeMap[currentThemeKey as keyof typeof themeMap] ?? defaultTheme;

  // ---------- Sx styles

  // Responsive wrapper box styles
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
      <CssBaseline /> {/* MUI baseline reset */}
      <GlobalStyle /> {/* Custom global styles */}
      <Box sx={wrapperStyles}>
        <AppInit /> {/* App initialization logic (auth, preload) */}
        {children}
      </Box>
    </ThemeProvider>
  );
}