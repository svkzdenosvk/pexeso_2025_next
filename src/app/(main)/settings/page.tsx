'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  settings_and_styling_before_start,
} from '@pexeso/lib/redux/store/reducers/gameSlice';
import {
  My_Type_ImgCount,
  My_Type_Level,
  My_Type_Svk_Eng_level,
} from '@pexeso/_inc/my_types';
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
} from '@pexeso/_inc/functions/general';
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';
import { useResetSettings } from "@pexeso/_inc/hooks/UseResetSettings";

/**
 * Game Settings Page
 *
 * This page allows users to select their game difficulty (level) and image count
 * before starting a new game. It uses Redux to store the selected settings,
 * and redirects to `/game` once valid choices are submitted.
 *
 * Features:
 * - Form with radio buttons to select level (easy/medium/hard)
 * - Form with radio buttons to select image count (5–8 pairs)
 * - Error handling for missing selections
 * - Automatic reset of previous settings and timer with hook
 * - On valid submission, dispatches game settings and redirects to game page
 *
 * @route /settings
 * @component
 * @dependencies
 * - Redux (dispatching game settings and reset)
 * - React Router (navigation to /game)
 * - i18next (for translations)
 * - MUI (form layout and styling)
 */

// ---------- Sx styles

// Style for the form container
const formStyles = {
  textAlign: 'center',
  mx: 'auto',
  mt: 2,
};

// Style for each fieldset (group of radio buttons)
const fieldsetStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

// Style for the alert
const alertStyles = {
  borderRadius: '25px',
  padding: '15px 25px',
  fontWeight: 'bold',
  justifyContent: 'center',
  textAlign: 'center',
  '& .MuiAlert-message': {
    width: '100%',
    textAlign: 'center',
  },
};

// ---------- Component

const GameSettingsPage = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();
  // const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  const [levelChosen, setLevelChosen] = useState('' as My_Type_Level);
  const [imgCountChosen, setImgCountChosen] = useState(0 as My_Type_ImgCount);
  const [error, setError] = useState('');

 // Reset settings from the game by own hook
  useResetSettings();

   // Possible image count options
  const imgCountValues: My_Type_ImgCount[] = [5, 6, 7, 8];

  // Possible game levels (labels are translated)
  const levels: My_Type_Svk_Eng_level[] = [
    { value: 'easy', label: t('settings_page.level.easy') },
    { value: 'medium', label: t('settings_page.level.medium') },
    { value: 'hard', label: t('settings_page.level.hard') },
  ];

  // Level values for validation
  const levelValues: My_Type_Level[] = ['easy', 'medium', 'hard'];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate level
    if (!my_Type_Guard_function(levelChosen, levelValues)) {
      setError('settings_page.error_alert.level');
      return;
    }

    // Validate image count
    if (!my_Type_Guard_function_number(imgCountChosen, imgCountValues)) {
      setError('settings_page.error_alert.img_count');
      return;
    }

    // If valid, not error -> dispatch game settings (level and img count) and styling based on them
    setError('');
    dispatch(
      settings_and_styling_before_start({
        level: levelChosen,
        selectedImgCount: imgCountChosen,
      })
    );

    // Reset form
    formRef.current?.reset();
    // Redirect to game
    router.push('/game');
  };

  return (
    <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={formStyles}>
      {/* Page title */}
      <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
        {t('settings_page.h5')}
      </Typography>

      {/* Level selection */}
      <FormControl sx={fieldsetStyles}>
        <FormLabel component="legend">
          {' '}
          {t('settings_page.legend.level')}
        </FormLabel>

        {/* Radio buttons for difficulty levels (easy, medium, hard) */}
        <RadioGroup
          row
          name="level"
          onChange={(e) => setLevelChosen(e.target.value as My_Type_Level)}
        >
          {/**
           * Dynamically renders difficulty levels from `levels` array.
           * Each item contains a `value` (used in logic) and a `label` (localized string).
           * Selection is stored in `levelChosen` state.
           */}
          {levels.map((lvl, i) => (
            <FormControlLabel
              key={i}
              value={lvl.value}
              control={<Radio />}
              label={lvl.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Image count selection */}
      <FormControl sx={fieldsetStyles}>
        <FormLabel component="legend">
          {t('settings_page.legend.img_count')}
        </FormLabel>

        {/* Radio buttons for selecting number of image pairs */}
        <RadioGroup
          row
          name="imageCount"
          onChange={(e) =>
            setImgCountChosen(parseInt(e.target.value) as My_Type_ImgCount)
          }
        >
          {/**
           * Dynamically renders radio buttons based on `imgCountValues` array.
           * Values represent the number of unique images (e.g., 5), but the label shown is doubled (e.g., 10 cards).
           * Selection is stored in `imgCountChosen` state.
           */}
          {imgCountValues.map((cnt, i) => (
            <FormControlLabel
              key={i}
              value={cnt.toString()}
              control={<Radio />}
              label={`${cnt * 2}`} // multiply by 2 because images come in pairs
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Show error message if present */}
      {error && (
        <Alert severity="error" sx={alertStyles}>
          {t(error)}
        </Alert>
      )}

      {/* Submit button */}
      <Button sx={pulsatingButtonStyles} type="submit">
        {t('settings_page.btn_play')}
      </Button>
    </Box>
  );
};

export default GameSettingsPage;
