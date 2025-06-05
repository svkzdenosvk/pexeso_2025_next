'use client';
import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// ---------- sx styles

const divStyles = {
  m: 'auto',
  minHeight: '70vh',
} as const;

const h1Styles = {
  fontWeight: 'bold',
  fontFamily: '"Times New Roman", serif',
} as const;

// ---------- component

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box sx={divStyles}>
      <Typography variant="h1" component="h1" sx={h1Styles}>
        {t('home_page.h1')}
      </Typography>
    </Box>
  );
};

export default Home;
