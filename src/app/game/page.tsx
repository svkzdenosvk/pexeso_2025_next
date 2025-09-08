'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography, Box, Button } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { RootState } from '@pexeso/lib/redux/store/store';
import { _myFormatSeconds } from '@pexeso/_inc/functions/general';
import NextLinkComposed from '@pexeso/components/SharedComponents/NextLinkComposed';
import PlayBoard from '@pexeso/components/RelatedToGame/PlayBoard';
import { TimeAndStart } from '@pexeso/components/RelatedToGame/TimeAndStart';
import { useGameInit } from '@pexeso/_inc/hooks/UseGameInit';

/**
 * Game page
 *
 * Main page that initializes and runs the Pexeso game.
 * Handles:
 * - Initialization via `useGameInit` hook (validation, redirect, card creation)
 * - Conditional rendering of instructions, timer, and game board
 * - Win message with elapsed time
 *
 * @route /game
 * @dependencies Redux, MUI, i18next, Next.js Router
 */

// ---------- Sx styles

// Button linking back to settings
const gameLinkButtonStyles = {
  backgroundColor: 'grey',
  maxWidth: '300px',
  border: 'none',
  color: 'white',
  fontWeight: 'bold',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px auto',
  cursor: 'pointer',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, transform 0.2s',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    color: 'goldenrod',
    backgroundColor: '#696969',
  },
} as const;

// Main welcome/start container styles
const welcomeStyles = {
  width: '100%',
  height: '100%',
  m: 0,
  p: 0,
  boxSizing: 'border-box',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '@media (min-width:1650px)': {
    width: '1650px',
  },
} as const;

// Styles for game board wrapper
const columnContentStyles = {
  maxWidth: '850px',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
} as const;

// ---------- component

const Game = () => {
  const { t } = useTranslation();

  // Get game state from Redux
  const seconds = useSelector((state: RootState) => state.time.seconds);
  const { linkName, isRunning, isEnd } = useSelector(
    (state: RootState) => state.game
  );

  // Dynamic styles based on game state

  // Determine if the game has started and not yet ended
  const afterStartStyles = isRunning && !isEnd;

  // Game board is only visible after game starts
  const dynamicColumnContentStyles = {
    ...columnContentStyles,
    display: afterStartStyles ? 'flex' : 'none',
  };

  // Conditionally styled instruction text (hidden during gameplay)
  const colorTextThemeStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    display: isRunning || isEnd ? 'none' : 'block',
  });

  /**
   * UseEffect hook:
   * 1. Validate game settings (level + image count)
   * 2. If invalid → redirect to /settings
   * 3. If valid → create shuffled card array & store in Redux
   */
    useGameInit();

  return (
    <>
      {/* Main game container */}
      <Box className="welcome" sx={welcomeStyles}>
        {/* Congratulation message when game ends */}
        {isEnd && (
          <Typography variant="h1" sx={{ marginBottom: '70px' }}>
            {t('game_page.congratulations')} {_myFormatSeconds(seconds)}
          </Typography>
        )}

        {/* Link to /settings  */}
        <Button
          component={NextLinkComposed}
          to="/settings"
          variant="contained"
          sx={gameLinkButtonStyles}
        >
          {t(linkName)}
        </Button>

        {/* Game instructions (hidden during gameplay) */}
        <Typography variant="h5" component="h5" sx={colorTextThemeStyles}>
          {t('game_page.h5')}
        </Typography>

        {/* Timer and Start button component */}
        <TimeAndStart />
      </Box>

      {/* Game board: appears only when game is running */}
      <Box
        className="column_content"
        id="content"
        sx={dynamicColumnContentStyles}
      >
        <PlayBoard />
      </Box>
    </>
  );
};

export default Game;
