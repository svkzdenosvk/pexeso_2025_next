import {
  My_Type_Img_Name,
  My_Type_Level,
  My_Type_DivImg,
  My_Type_ClassNames,
  My_Type_ImgCount,
  My_Type_Theme,
} from '@pexeso/_inc/my_types';
import { _shuffleArray } from '@pexeso/_inc/_inc_functions';

import { createSlice } from '@reduxjs/toolkit';

//----------------------------------------------------------------------------redux toolkit

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    imgNames: ["drop", "wood", "lightning", "wind", "vibration", "sun" , "space", "sea"] as My_Type_Img_Name[],
    isLoading: true,
    isRunning: false,
    // linkName: "Späť na nastavenia hry.",
    linkName: 'game_page.link_before_start',
    level: '' as My_Type_Level,
    isEnd: false,
    divImgs: [] as My_Type_DivImg[],
    selectedImgCount: 0 as My_Type_ImgCount,
    theme: 'defaultTheme' as My_Type_Theme,
  },
  reducers: {
    set_start_game: (state) => {
      //-----------------------------------------------------------------------start the game
      state.isRunning = true;
      // state.linkName = 'Nova hra';

      state.linkName = 'game_page.link_after_start';
    },
    hardest_level_shuffle: (state) => {
      //-----------------------------------------------------------------------when level is the "hardest" shuffle cards every 0.4 sec.
      let afterUnMatchArr = _shuffleArray(state.divImgs);

      state.divImgs = afterUnMatchArr;
    },
    showOne: (state, action) => {
      //------------------------------------------------------------------------show/reveal one picture after click on that
      state.divImgs.forEach((oneDiv) => {
        if (oneDiv.id === action.payload.id) {
          oneDiv.classNames = [
            ...oneDiv.classNames.filter((className) => className !== 'mask'),
            'selected_Div_img',
          ];
        }
      });
    },
    un_match: (state, action) => {
      //------------------------------------------after revealing 2 pictures which are not same
      let afterUnMatchArr: My_Type_DivImg[] = state.divImgs.map((oneDiv) => {
        if (oneDiv.classNames.includes('selected_Div_img')) {
          return {
            ...oneDiv,
            classNames: [
              ...oneDiv.classNames.filter(
                (className) => className !== 'selected_Div_img'
              ),
              'mask', // remove "selected" and add "mask" class
            ],
          }; /*----------------------------------------------------------------change 2 selected img´s to nonselected and hide */
        } else {
          return oneDiv; /*----------------------------------------------------if img wasn´t selected -> nothing to change  */
        }
      });

      if (action.payload === 'medium' /*||action.payload==="hardest"*/) {
        afterUnMatchArr = _shuffleArray(afterUnMatchArr);
      }
      state.divImgs = afterUnMatchArr;
    },
    match: (state) => {
      //-----------------------------------------------------when 2 revealed pictures are same

      let afterMatchArr: My_Type_DivImg[] = state.divImgs.map((oneDiv) => {
        if (oneDiv.classNames.includes('selected_Div_img')) {
          return {
            ...oneDiv,
            classNames: [
              ...oneDiv.classNames.filter(
                (className) => className !== 'selected_Div_img'
              ),
              'rotate-center',
            ] as My_Type_ClassNames[],
          }; /*--------------------------------------------------------------- remove selected and add rotate -> change 2 selected img´s to nonselected and hide */
        } else {
          return oneDiv; /*----------------------------------------------------if img wasn´t selected -> nothing to change  */
        }
      });

      state.divImgs = afterMatchArr;
    },
    remove_after_match: (state) => {
      let afterAfterMatchArr: My_Type_DivImg[] = state.divImgs.filter(
        (oneDiv) => !oneDiv.classNames.includes('rotate-center')
      );

      state.divImgs = afterAfterMatchArr; //-----------------------------------if all pictures removed -> it´s end of the game
    },
    end_game: (state) => {
      //-----------------------------------------------------------------------the game is over after all imgs has been removed
      state.isRunning = false;
      // state.linkName = 'Hraj znova';
      state.linkName = 'game_page.link_end_game';
      state.isEnd = true;
    },
    after_settings_selected_img_count: (state, action) => {
      state.divImgs = action.payload;
      // state.isLoading=false; //---------------------------------------------maybe for the future to test this  !!!!!!
    },
    reset_settings: (state) => {
      //-----------------------------------------------------------------------evrytime we return on settings page
      state.level = '' as My_Type_Level;
      state.selectedImgCount = 0 as My_Type_ImgCount;
      state.isRunning = false;
      state.isEnd = false;
      state.theme = 'defaultTheme';
    },
    settings_and_styling_before_start: (state, action) => {
      //-----------------------------------------------------------------------after set the settings (but before clicking to start button)

      const levelChanges: Record<My_Type_Level, My_Type_Theme> = {
        /*----------------------------------------------------------------------using dynamic object properties*/
        easy: 'defaultTheme',
        medium: 'mediumTheme',
        hard: 'hardTheme',
      };

      //state.isEnd=false;//----------------------------------------------------maybe this could be decommented .. in case of problems in the future
      state.level = action.payload.level;
      state.selectedImgCount = action.payload
        .selectedImgCount as My_Type_ImgCount;
      state.theme = levelChanges[
        action.payload.level as My_Type_Level
      ] as My_Type_Theme;
    },
    // set_img_names: (state, action) => {
    //   //------------------------------------------------------------------------after fetching names from db
    //   state.imgNames = action.payload;
    // },

    //after loading imgs (in app.tsx)
    set_loading: (state) => {
      //------------------------------------------------------------------------after loading imgs (in app.tsx)
      state.isLoading = false;
    },
  },
});

export const {
  set_start_game,
  set_loading,
  // set_img_names,
  settings_and_styling_before_start,
  after_settings_selected_img_count,
  remove_after_match,
  match,
  un_match,
  reset_settings,
  showOne,
  hardest_level_shuffle,
  end_game,
} = gameSlice.actions;
export default gameSlice.reducer;
