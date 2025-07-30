'use client';

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { My_Type_MySuspenseProp } from '@pexeso/_inc/my_types';


export default function MySuspense({ children, loadingText = '' }:My_Type_MySuspenseProp) {
      const { t } = useTranslation();
    
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            height: '100%',
            width: '100%',
            fontSize: '1.2rem',
            mt: '20px',
          }}
        >
          <CircularProgress />
          {loadingText &&  t(loadingText)}
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}
