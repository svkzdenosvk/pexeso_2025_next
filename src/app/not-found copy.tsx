'use client';
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
const ErrorPage = () => {
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
};

export default ErrorPage;
