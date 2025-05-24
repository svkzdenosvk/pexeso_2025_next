'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box } from '@mui/material';
import type { Theme } from '@mui/material/styles';

import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
  _myFormatSeconds,
} from '@pexeso/_inc/_inc_functions';

import { createDivsArrayFromImgNamesAndCountImg } from '@pexeso/_inc/data';
import { after_settings_selected_img_count } from '@pexeso/redux/store/reducers/gameSlice';
import { RootState } from '@pexeso/redux/store/store';
import { My_Type_DivImg } from '@pexeso/_inc/my_types';

import { MyMUIButton } from '@pexeso/components/SharedMUIElements/MyMUIButton';
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

const columnContentStyles = {
  maxWidth: '850px',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
} as const;

const Game = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const seconds = useSelector((state: RootState) => state.time.seconds);
  const { imgNames, level, selectedImgCount, linkName, isRunning, isEnd } =
    useSelector((state: RootState) => state.game);

  const afterStartStyles = isRunning && !isEnd;

  const dynamicColumnContentStyles = {
    ...columnContentStyles,
    display: afterStartStyles ? 'flex' : 'none',
  };

  const colorTextThemeStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    display: isRunning || isEnd ? 'none' : 'block',
  });

  useEffect(() => {
    if (
      !my_Type_Guard_function(level, ['easy', 'medium', 'hard']) ||
      !my_Type_Guard_function_number(selectedImgCount, [5, 6, 7, 8])
    ) {
      router.push('/settings');
      return;
    }

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
      <Box className="welcome" sx={welcomeStyles}>
        {isEnd && (
          <Typography variant="h1" sx={{ marginBottom: '70px' }}>
            Gratulácia, vyhrali ste za {_myFormatSeconds(seconds)}
          </Typography>
        )}

        <MyMUIButton sx={gameLinkButtonStyles} to="/settings">
          {linkName}
        </MyMUIButton>

        <Typography variant="h5" component="h5" sx={colorTextThemeStyles}>
          Pre začatie hry stlačte tlačítko štart
        </Typography>

        <TimeAndStart />
      </Box>

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
