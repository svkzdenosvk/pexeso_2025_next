'use client';
import React, { useMemo } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import i18n from '@pexeso/lib/i18n/i18n'; // tvoj i18n init súbor
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';

// ---------- sx styles
const boxStyles = {
  mt: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  width: '100%',
} as const;

// ---------- component

export default function NotFoundPage() {

  //set english language for not found page
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

function ErrorPage() {
  const { t } = useTranslation();

  return (
    <Box sx={boxStyles}>
      <Typography variant="h3" component="h3">
        {' '}
        {/*originally h1 */}
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

