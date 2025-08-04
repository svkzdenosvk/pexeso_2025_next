'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@mui/material/styles';
import { RootState } from '@pexeso/lib/redux/store/store';
import { seconds_counter } from '@pexeso/lib/redux/store/reducers/secondsSlice';
import { set_start_game } from '@pexeso/lib/redux/store/reducers/gameSlice';

/**
 * TimeAndStart Component
 *
 * Displays an interactive game timer and a start button.
 * Manages game state via Redux: timer, loading, running, and end status.
 *
 * @component
 * @example
 * <TimeAndStart />
 *
 * @remarks
 * This component does not receive props; it relies on Redux state.
 *
 * @dependencies
 * react-i18next, Redux, MUI
 */

// ---------- Sx styles

// Styles for the "START" button
const startButtonStyles = {
  color: 'white',
  borderRadius: '50%',
  backgroundColor: '#99103a',
  padding: '20px',
  fontSize: '300%',
  float: 'left',
  fontWeight: 'bold',
  '&:hover': {
    color: '#cc0606',
  },
} as const;

// ---------- Component

export const TimeAndStart = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // Redux state selectors
  const seconds = useSelector((state: RootState) => state.time.seconds);
  const { isRunning, isLoading, isEnd } = useSelector(
    (state: RootState) => state.game
  );

  // Dynamic styles based on game state
  const dynamicStartButtonStyles = {
    ...startButtonStyles,
    display: isRunning || isEnd ? 'none' : 'block', // hide button when game is running/over
  };

  const dynamicSecondsStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    padding: '20px',
    fontSize: '300%',
    float: 'left',
    fontWeight: 'bold',
    display: isEnd ? 'none' : 'block', // hide timer when game ends
  });

  // Seconds counter
  useEffect(() => {
    if (!isRunning || isLoading || isEnd) return; // only runs when game is active

    const interval = setInterval(() => {
      dispatch(seconds_counter()); // increment seconds
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [isRunning, dispatch, isLoading, isEnd]);

  // Start game handler -> start count of seconds
  const handleStartClick = () => {
    dispatch(set_start_game());
  };

  return (
    <Box id="timeAndStart" sx={{ display: 'flex' }}>
      {/* Display current time */}
      <Box id="seconds" sx={dynamicSecondsStyles}>
        {seconds} s
      </Box>

      {/* Start button*/}
      <Button
        variant="contained"
        id="start"
        sx={dynamicStartButtonStyles}
        onClick={handleStartClick}
      >
        {t('game_page.btn_start')}
      </Button>
    </Box>
  );
};

export default TimeAndStart;
