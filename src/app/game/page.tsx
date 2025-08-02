'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography, Box, Button } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { RootState } from '@pexeso/lib/redux/store/store';
import { after_settings_selected_img_count } from '@pexeso/lib/redux/store/reducers/gameSlice';
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
  _myFormatSeconds,
} from '@pexeso/_inc/_inc_functions';
import { createDivsArrayFromImgNamesAndCountImg } from '@pexeso/_inc/data';
import { My_Type_DivImg } from '@pexeso/_inc/my_types';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';
import { GameDivPictures } from '@pexeso/components/RelatedToGame/GameDivPictures';
import { TimeAndStart } from '@pexeso/components/RelatedToGame/TimeAndStart';

// ---------- sx styles
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

// Main container styles
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

// Game board styles
const columnContentStyles = {
  maxWidth: '850px',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
} as const;

// ---------- component

const Game = () => {
  const { t } = useTranslation(); // translation hook

  const router = useRouter();
  const dispatch = useDispatch();

  // Get game state from Redux
  const seconds = useSelector((state: RootState) => state.time.seconds);
  const { imgNames, level, selectedImgCount, linkName, isRunning, isEnd } =
    useSelector((state: RootState) => state.game);

  // Dynamic styles based on game state
  const afterStartStyles = isRunning && !isEnd;

  const dynamicColumnContentStyles = {
    ...columnContentStyles,
    display: afterStartStyles ? 'flex' : 'none',
  };

  const colorTextThemeStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    display: isRunning || isEnd ? 'none' : 'block',
  });

  // if level or img count is not valid -> redirect back
  useEffect(() => {
    if (
      !my_Type_Guard_function(level, ['easy', 'medium', 'hard']) ||
      !my_Type_Guard_function_number(selectedImgCount, [5, 6, 7, 8])
    ) {
      router.push('/settings');
      return;
    }

    //create array of objects (div > img) to play from img names and img count
    const createFinalArrayFroGame = async () => {
      try {
        const imgDivs: My_Type_DivImg[] =
          await createDivsArrayFromImgNamesAndCountImg(
            selectedImgCount,
            imgNames
          );

        dispatch(after_settings_selected_img_count(imgDivs));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    createFinalArrayFroGame();
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

      {/* Game board (shown only during gameplay) */}
      <Box
        className="column_content"
        id="content"
        sx={dynamicColumnContentStyles}
      >
        <GameDivPictures />
      </Box>
    </>
  );
};

export default Game;
