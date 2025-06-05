'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';

// ---------- component

const AboutGame = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mx: 'auto' }}>
      <Typography variant="h2" component="h2">
        {' '}
        {/*originally h1 */}
        {t('about_page.h2')}
      </Typography>
      <div className="img"></div>
    </Box>
  );
};

export default AboutGame;
