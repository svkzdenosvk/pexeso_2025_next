'use client';
import React, { useMemo } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import i18n from '@pexeso/lib/i18n/i18n';
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';
import NextLinkComposed from '@pexeso/components/SharedComponents/NextLinkComposed';

/**
 * NotFoundPage handles rendering a user-friendly 404 page.
 *
 * Features:
 * - Displays a localized message for "page not found"
 * - Forces English language (fallback for routing/language issues)
 * - Styled using MUI and shared styles
 * - Offers button to return to homepage
 *
 * @component
 * @example
 * Used as default fallback in `app/not-found.tsx`
 *
 * @remarks
 * Uses i18n.cloneInstance to avoid affecting global language setting.
 *
 * @dependencies
 * i18next, MUI, custom `NextLinkComposed`, shared styles
 */

// ---------- sx styles

// Container styles for layout and spacing
const boxStyles = {
  mt: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  width: '100%',
} as const;

// ---------- Component

/**
 * Wrapper component that forces English i18n for the NotFoundPage
 * to ensure consistent fallback when routing fails or language is not set.
 */
export default function NotFoundPage() {
  // Set up a new i18n instance scoped to English for this page only
  const i18nEnglish = useMemo(() => {
    const instance = i18n.cloneInstance();
    instance.changeLanguage('en');
    return instance;
  }, []);

  return (
    <I18nextProvider i18n={i18nEnglish}>
      <ErrorPage />
    </I18nextProvider>
  );
}

/**
 * ErrorPage component renders the visible 404 message and navigation button.
 */
function ErrorPage() {
  const { t } = useTranslation();

  return (
    <Box sx={boxStyles}>
      <Typography variant="h3" component="h3">
        {' '}
        {t('not_found_page.h3')}
      </Typography>

      <Button
        component={NextLinkComposed}
        to="/"
        variant="contained"
        sx={pulsatingButtonStyles}
      >
        {t('not_found_page.btn_back')}
      </Button>
    </Box>
  );
}
