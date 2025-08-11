import type {
  My_Type_Img_Name,
  My_Type_Level,
  My_Type_Card_Obj,
  My_Type_ClassNames,
  My_Type_ImgCount,
  My_Type_Theme,
} from '@pexeso/_inc/my_types';
import { _shuffleUnMatchedCards } from '@pexeso/_inc/functions/gameRelated';
import { _shuffleArray } from '@pexeso/_inc/functions/general';
import { createSlice } from '@reduxjs/toolkit';

/**
 * This slice handles all logic related to the core gameplay of the Pexeso (Memory) game.
 *
 * State includes:
 * - Available image names
 * - Game level (easy, medium, hard)
 * - Current game status (isRunning, isEnd)
 * - The card objects in play
 * - Selected image count
 * - Theme applied to the game (affects styling)
 * - Link name for routing or i18n display purposes
 */

//----------------------------------------------------------------------------redux toolkit

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    imgNames: [
      'drop',
      'wood',
      'lightning',
      'wind',
      'vibration',
      'sun',
      'space',
      'sea',
    ] as My_Type_Img_Name[],
    isLoading: true,
    isRunning: false,
    linkName: 'game_page.link_before_start',
    level: '' as My_Type_Level,
    isEnd: false,
    cards: [] as My_Type_Card_Obj[],
    selectedImgCount: 0 as My_Type_ImgCount,
    theme: 'defaultTheme' as My_Type_Theme,
  },
  reducers: {
    // Start the game
    set_start_game: (state) => {
      state.isRunning = true;
      state.linkName = 'game_page.link_after_start';
    },

    // Only for "hard" level – randomly reshuffles all cards periodically
    hardest_level_shuffle: (state) => {
      const afterUnMatchArr = _shuffleArray(state.cards);

      state.cards = afterUnMatchArr;
    },

    //Reveals one selected card (adds 'selected_Div_img' class, removes 'mask').
    showOne: (state, action) => {
      state.cards.forEach((oneCard) => {
        if (oneCard.id === action.payload.id) {
          oneCard.classNames = [
            ...oneCard.classNames.filter((className) => className !== 'mask'),
            'selected_Div_img',
          ];
        }
      });
    },

    /**
     * When two selected cards do not match:
     * - Removes 'selected' class
     * - Reapplies 'mask' class (hides them again)
     * - Optionally reshuffles cards (only in 'medium' level)
     */
    un_match: (state, action) => {
      const afterUnMatchArr: My_Type_Card_Obj[] = state.cards.map((oneCard) => {
        //change 2 selected img´s to nonselected and hide
        if (oneCard.classNames.includes('selected_Div_img')) {
          return {
            ...oneCard,
            classNames: [
              ...oneCard.classNames.filter(
                (className) => className !== 'selected_Div_img'
              ),
              'mask', // remove "selected" and add "mask" class
            ],
          };
        } else {
          // if img wasn´t selected -> nothing to change
          return oneCard;
        }
      });

      let shuffledUnMatchedCards = afterUnMatchArr;

      // If medium difficulty – shuffle only unmatched (masked) cards
      if (action.payload === 'medium') {
        shuffledUnMatchedCards = _shuffleUnMatchedCards(afterUnMatchArr);
      }

      state.cards = shuffledUnMatchedCards;
    },

    /**
     * When two selected cards match:
     * - Removes 'selected' class
     * - Adds 'rotate-center' class for animation
     */
    match: (state) => {
      const afterMatchArr: My_Type_Card_Obj[] = state.cards.map((oneCard) => {
        //remove selected and add rotate -> change 2 selected img´s to nonselected and hide
        if (oneCard.classNames.includes('selected_Div_img')) {
          return {
            ...oneCard,
            classNames: [
              ...oneCard.classNames.filter(
                (className) => className !== 'selected_Div_img'
              ),
              'rotate-center',
            ] as My_Type_ClassNames[],
          };
        } else {
          //if img wasn´t selected -> nothing to change
          return oneCard;
        }
      });

      state.cards = afterMatchArr;
    },

    /**
     * After match animation finishes, remove matched cards visually by:
     * - Removing 'rotate-center'
     * - Adding 'disabled' class
     */
    remove_after_match: (state) => {
      const afterAnimationMatchArr: My_Type_Card_Obj[] = state.cards.map(
        (oneCard) => {
          // remove rotate-center and add disabled class
          if (oneCard.classNames.includes('rotate-center')) {
            return {
              ...oneCard,
              classNames: [
                ...oneCard.classNames.filter(
                  (className) => className !== 'rotate-center'
                ),
                'disabled',
              ] as My_Type_ClassNames[],
            };
          } else {
            //if img wasn´t selected -> nothing to change
            return oneCard;
          }
        }
      );
      // if all pictures removed -> it´s end of the game
      state.cards = afterAnimationMatchArr;
    },

    // The game is over after all imgs has been removed
    end_game: (state) => {
      state.isRunning = false;
      state.linkName = 'game_page.link_end_game';
      state.isEnd = true;
    },

    /**
     * Creates the card array after user selects settings (before start).
     * Payload should be an array of card objects.
     */
    create_cards_arr: (state, action) => {
      state.cards = action.payload;
      // state.isLoading=false; //---------------------------------------------maybe for the future to test this  !!!!!!
    },
    // Resets settings to initial (used when going back to settings page).
    reset_settings: (state) => {
      state.level = '' as My_Type_Level;
      state.selectedImgCount = 0 as My_Type_ImgCount;
      state.isRunning = false;
      state.isEnd = false;
      state.theme = 'defaultTheme';
    },

    /**
     * Applies settings and assigns the theme based on difficulty level.
     * After settings but before clicking to start button
     */
    settings_and_styling_before_start: (state, action) => {
      /*using dynamic object properties*/
      const levelChanges: Record<My_Type_Level, My_Type_Theme> = {
        easy: 'defaultTheme',
        medium: 'mediumTheme',
        hard: 'hardTheme',
      };

      state.level = action.payload.level;
      state.selectedImgCount = action.payload
        .selectedImgCount as My_Type_ImgCount;
      state.theme = levelChanges[
        action.payload.level as My_Type_Level
      ] as My_Type_Theme;
    },

    // Indicates that loading (e.g. image preloading) is done.
    set_loading: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  set_start_game,
  set_loading,
  settings_and_styling_before_start,
  create_cards_arr,
  remove_after_match,
  match,
  un_match,
  reset_settings,
  showOne,
  hardest_level_shuffle,
  end_game,
} = gameSlice.actions;
export default gameSlice.reducer;
