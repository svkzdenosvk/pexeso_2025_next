'use client';

// Core React imports
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// UI Components
import { Typography, Box } from '@mui/material';
import type { Theme } from '@mui/material/styles';

// Types and store
import { My_Type_Card_Obj } from '@pexeso/_inc/my_types';
import { RootState } from '@pexeso/lib/redux/store/store';
import {
  match,
  un_match,
  hardest_level_shuffle,
} from '@pexeso/lib/redux/store/reducers/gameSlice';
import { showImg } from '@pexeso/_inc/_inc_functions';

import Card from './Card';

/**
 * GameBoard Component
 *
 * Displays the game board with interactive cards.
 * Handles core game logic: selection, matching, and shuffling.
 *
 * @component
 * @example
 * <GameBoard />
 *
 * @remarks
 * This component does not receive props; it relies on Redux state.
 *
 * @dependencies
 * react-i18next, Redux, MUI
 */

// ---------- Sx styles

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

// ---------- Component

const GameBoard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Select game state from Redux
  const { cards, level, isLoading } = useSelector(
    (state: RootState) => state.game
  );

  // Game logic for comparing selected images
  useEffect(() => {
    const timeout = setTimeout(() => {
      const selectedArr = cards.filter((oneCard) =>
        oneCard.classNames.includes('selected_Div_img')
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
  }, [dispatch, cards, level]);

  return (
    <Box className="row" id="row" sx={rowStyles}>
      {/* during loading show message */}
      {isLoading ? (
        <Typography variant="h2" component="h2" sx={colorTextThemeStyles}>
          {t('loading_alerts.images')}
        </Typography>
      ) : (
        // images to play
        cards.map((oneCard) => (
          <Card
            key={oneCard.id}
            card={oneCard}
            onClick={(e) => showImg(e.currentTarget, oneCard, cards)}
          />
        ))
      )}
    </Box>
  );
};

export default GameBoard;
