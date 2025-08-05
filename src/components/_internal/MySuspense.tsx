'use client';

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { My_Type_MySuspenseProp } from '@pexeso/_inc/my_types';

/**
 * Custom wrapper for React's `Suspense` that shows a loading indicator while content is being loaded.
 *
 * Features:
 * - Displays a centered spinner and optional translated loading text
 * - Uses Material UI `CircularProgress` for visual feedback
 * - Integrates `react-i18next` for internationalized loading messages
 *
 * @component
 * @example
 * <MySuspense loadingText="loading.something">
 *   <MyLazyComponent />
 * </MySuspense>
 *
 * @param {My_Type_MySuspenseProp} props - Children elements and optional loading text key
 *
 * @remarks
 * This is a client component. It enhances UX during lazy loading or data fetching.
 *
 * @dependencies
 * react, @mui/material, react-i18next
 */

export default function MySuspense({
  children,
  loadingText = '',
}: My_Type_MySuspenseProp) {
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
          {/* Spinner */}
          <CircularProgress />

          {/* Optional translated loading message */}
          {loadingText && t(loadingText)}
        </Box>
      }
    >
      {/* Loaded content will render here */}
      {children}
    </Suspense>
  );
}
