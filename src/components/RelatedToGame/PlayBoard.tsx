'use client';

// Core React imports
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// UI Components
import { Typography, Box } from '@mui/material';
import type { Theme } from '@mui/material/styles';

// Types and store
import { RootState } from '@pexeso/lib/redux/store/store';

import { showImg } from '@pexeso/_inc/functions/gameRelated';
import { usePlayBoardLogic } from '@pexeso/_inc/hooks/UsePlayBoardLogic';
import type { My_Type_Card_Obj } from '@pexeso/_inc/my_types';

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

const PlayBoard = () => {
  const { t } = useTranslation();

  // Select game state from Redux
  const { cards, level, isLoading } = useSelector(
    (state: RootState) => state.game
  );

  // Hook: encapsulates card match/unmatch + shuffle logic
  const { revealCard } = usePlayBoardLogic(cards, level);

  // Handle click on single card → delegate to hook
  const handleCardClick = (e: React.MouseEvent, card: My_Type_Card_Obj) => {
    const element = e.currentTarget as HTMLDivElement;
    revealCard(element, card);
  };

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
            onClick={(e) => handleCardClick(e, oneCard)}
          />
        ))
      )}
    </Box>
  );
};

export default PlayBoard;
