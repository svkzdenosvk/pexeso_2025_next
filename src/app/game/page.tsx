'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography, Box, Button } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { RootState } from '@pexeso/lib/redux/store/store';
import { create_cards_arr } from '@pexeso/lib/redux/store/reducers/gameSlice';
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
  _myFormatSeconds,
} from '@pexeso/_inc/_inc_functions';
import { createDivsArrayFromImgNamesAndCountImg } from '@pexeso/_inc/data';
import { My_Type_Card_Obj } from '@pexeso/_inc/my_types';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';
import GameBoard from '@pexeso/components/RelatedToGame/GameBoard';
import { TimeAndStart } from '@pexeso/components/RelatedToGame/TimeAndStart';

/**
 * Game page responsible for rendering the Pexeso game board,
 * initializing the game based on selected settings, and handling user interaction.
 *
 * Features:
 * - Initializes card set based on Redux state (level + images)
 * - Redirects to `/settings` if game setup is invalid
 * - Shows start button and timer
 * - Renders game board only during active play
 * - Displays win message and elapsed time on completion
 *
 * @component
 * @route /game
 * @dependencies Redux (state management), MUI (layout), i18next (translations)
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
  const { t } = useTranslation(); // i18n translation hook

  const router = useRouter();
  const dispatch = useDispatch();

  // Get game state from Redux
  const seconds = useSelector((state: RootState) => state.time.seconds);
  const { imgNames, level, selectedImgCount, linkName, isRunning, isEnd } =
    useSelector((state: RootState) => state.game);

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
   * On component mount:
   * - Validate selected game level and image count
   * - Redirect to `/settings` if invalid
   * - Otherwise, build card array and dispatch to Redux
   */
  useEffect(() => {
    if (
      !my_Type_Guard_function(level, ['easy', 'medium', 'hard']) ||
      !my_Type_Guard_function_number(selectedImgCount, [5, 6, 7, 8])
    ) {
      router.push('/settings');
      return;
    }

    //Create array of cards [objects (div > img)] to play from img names and img count
    const createFinalCardArray = async () => {
      try {
        const cards: My_Type_Card_Obj[] =
          await createDivsArrayFromImgNamesAndCountImg(
            selectedImgCount,
            imgNames
          );

        dispatch(create_cards_arr(cards));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    createFinalCardArray();
  }, [level, selectedImgCount, router, dispatch, imgNames]);

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
        <GameBoard />
      </Box>
    </>
  );
};

export default Game;
