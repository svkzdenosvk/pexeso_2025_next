'use client';

import React from 'react';
import { Button, ButtonGroup, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Language selector component that displays a button group
 * for switching between supported languages.
 *
 * Features:
 * - Uses react-i18next for translation management
 * - Visual feedback for currently active language
 * - Responsive Material-UI button group
 *
 * @component
 * @example
 * <TranslateButton />
 * 
  * @remarks
 * This component relies on `react-i18next` and does not require props.
 *
 * @dependencies
 * @mui/material, react-i18next
 */

// ---------- Component

const TranslateButton = () => {
  // Access i18n instance and current language
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  /**
   * Changes the application language
   * @param {string} lng - Language code (e.g. 'en', 'sk')
   */
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Supported languages array
  const languages = ['en', 'sk', 'de'];

  return (
    <Box
      sx={{
        mt: 1,
        mb: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ButtonGroup
        variant="outlined"
        color="primary"
        sx={{
          boxShadow: 3, // medium shadow elevation
          borderRadius: '12px',
          overflow: 'hidden', // ensures child buttons respect border radius
        }}
      >
        {languages.map((lng) => (
          <Button
            key={lng}
            onClick={() => changeLanguage(lng)}

            // Highlight current language with filled variant
            variant={currentLang === lng ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'uppercase', // EN/SK/DE instead of En/Sk/De
              fontWeight: 'bold',
              px: 2,
              py: 1,
              fontSize: '0.85rem', // slightly smaller text
              minWidth: 50,
            }}
          >
            {lng}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default TranslateButton;
