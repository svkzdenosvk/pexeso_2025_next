'use client';

// Core React imports
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// UI Components
import { Typography, Box } from '@mui/material';
import type { Theme } from '@mui/material/styles';

// Types and store
import { My_Type_DivImg } from '@pexeso/_inc/my_types';
import { RootState } from '@pexeso/lib/redux/store/store';
import {
  showOne,
  match,
  un_match,
  hardest_level_shuffle,
} from '@pexeso/lib/redux/store/reducers/gameSlice';

// ---------- sx styles

const imgStyles = {
  width: '107px',
  height: '107px',
  opacity: '0%',
} as const;

// Clickable box styles
const divOnCliCkBoxStyles = {
  width: '107px',
  height: '107px',
  position: 'relative',
  borderRadius: 2,
  overflow: 'hidden',
} as const;

// Row layout styles
const rowStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  flexWrap: 'wrap',
  flex: '1 1 50%',
  mt: '1.5%',
} as const;

const colorTextThemeStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
});

// ---------- component

export const GameDivPictures = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Select game state from Redux
  const { divImgs, level, isLoading } = useSelector(
    (state: RootState) => state.game
  );

  // Show picture behind joker picture
  const showImg = (element: HTMLDivElement, divObject: My_Type_DivImg) => {
    const selectedArr = divImgs.filter((oneDiv) =>
      oneDiv.classNames.includes('selected_Div_img')
    );
    const rotatedArr = divImgs.filter((oneDiv) =>
      oneDiv.classNames.includes('rotate-center')
    );

    if (
      element.classList.contains('mask') &&
      (selectedArr.length === 0 || selectedArr.length === 1) &&
      rotatedArr.length === 0
    ) {
      dispatch(showOne(divObject));
    }
  };

  //deepstate optimalization HELP
  // Handle image click (memoized for performance)
  // const showImg = useCallback(
  //   (element: HTMLDivElement, divObject: My_Type_DivImg) => {
  //     const selectedArr = divImgs.filter((oneDiv) =>
  //       oneDiv.classNames.includes('selected_Div_img')
  //     );
  //     const rotatedArr = divImgs.filter((oneDiv) =>
  //       oneDiv.classNames.includes('rotate-center')
  //     );

  //     if (
  //       element.classList.contains('mask') &&
  //       selectedArr.length <= 1 &&
  //       rotatedArr.length === 0
  //     ) {
  //       dispatch(showOne(divObject));
  //     }
  //   },
  //   [divImgs, dispatch]
  // );

  // Game logic for comparing selected images
  useEffect(() => {
    const timeout = setTimeout(() => {
      const selectedArr = divImgs.filter((oneDiv) =>
        oneDiv.classNames.includes('selected_Div_img')
      );

      if (selectedArr.length === 2) {
        if (selectedArr[0].name === selectedArr[1].name) {
          dispatch(match());
        } else {
          dispatch(un_match(level));
        }
      }

      document.body.style.pointerEvents = 'auto';
    }, 200);

    // shuffle if level is hard
    if (level === 'hard') {
      const intervalShuffle = setInterval(() => {
        dispatch(hardest_level_shuffle());
      }, 400);

      return () => clearInterval(intervalShuffle);
    }

    return () => clearTimeout(timeout);
  }, [dispatch, divImgs, level]);

  //after show f . try ... try this new logic if its better - its help from deepseek
  // Game logic for matching cards
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     const selectedArr = divImgs.filter(oneDiv =>
  //       oneDiv.classNames.includes('selected_Div_img')
  //     );

  //     if (selectedArr.length === 2) {
  //       document.body.style.pointerEvents = 'none'; // Prevent clicks during animation
  //       if (selectedArr[0].name === selectedArr[1].name) {
  //         dispatch(match());
  //       } else {
  //         dispatch(un_match(level));
  //       }
  //     }
  //   }, 200); // Delay for card flip animation

  //   // Hard level shuffle effect
  //   if (level === 'hard') {
  //     const intervalShuffle = setInterval(() => {
  //       dispatch(hardest_level_shuffle());
  //     }, 400);

  //     return () => clearInterval(intervalShuffle);
  //   }

  //   return () => {
  //     clearTimeout(timeout);
  //     document.body.style.pointerEvents = 'auto'; // Restore clicks
  //   };
  // }, [dispatch, divImgs, level]);

  return (
    <Box className="row" id="row" sx={rowStyles}>
      {/* during loading show message */}
      {isLoading ? (
        <Typography variant="h2" component="h2" sx={colorTextThemeStyles}>
          {t('loading_alerts.images')}
        </Typography>
      ) : (
        // images to play
        divImgs.map((oneDiv) => (
          <Box
            sx={divOnCliCkBoxStyles}
            key={oneDiv.id}
            onClick={(e) => showImg(e.currentTarget, oneDiv)}
            className={oneDiv.classNames.join(' ')}
          >
            <Box
              component="img"
              src={`/pictures/pexeso/${oneDiv.name}.jpg`}
              alt={`Pexeso img ${oneDiv.name}`}
              sx={imgStyles}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

export default GameDivPictures;
