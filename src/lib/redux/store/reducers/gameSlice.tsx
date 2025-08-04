import type {
  My_Type_Img_Name,
  My_Type_Level,
  My_Type_Card_Obj,
  My_Type_ClassNames,
  My_Type_ImgCount,
  My_Type_Theme,
} from "@pexeso/_inc/my_types";
import { _shuffleArray,_shuffleUnMatchedCards } from "@pexeso/_inc/_inc_functions";

import { createSlice } from "@reduxjs/toolkit";

//----------------------------------------------------------------------------redux toolkit

const gameSlice = createSlice({
  name: "game",
  initialState: {
    imgNames: ["drop", "wood", "lightning", "wind", "vibration", "sun" , "space", "sea"] as My_Type_Img_Name[],
    isLoading: true,
    isRunning: false,
    linkName: "game_page.link_before_start",
    level: "" as My_Type_Level,
    isEnd: false,
    cards: [] as My_Type_Card_Obj[],
    selectedImgCount: 0 as My_Type_ImgCount,
    theme: "defaultTheme" as My_Type_Theme,
  },
  reducers: {
    // start the game
    set_start_game: (state) => {
      state.isRunning = true;
      state.linkName = "game_page.link_after_start";
    },
    // when level is the "hardest" shuffle cards every 0.4 sec.
    hardest_level_shuffle: (state) => {
      const afterUnMatchArr = _shuffleArray(state.cards);
      // const afterUnMatchArr = _shuffleUnMatchedCards(state.divImgs);

      state.cards = afterUnMatchArr;
    },
    showOne: (state, action) => {
      // show/reveal one picture after click on that
      state.cards.forEach((oneCard) => {
        if (oneCard.id === action.payload.id) {
          oneCard.classNames = [
            ...oneCard.classNames.filter((className) => className !== "mask"),
            "selected_Div_img",
          ];
        }
      });
    },
    un_match: (state, action) => {
      //after revealing 2 pictures which are not same
      const afterUnMatchArr: My_Type_Card_Obj[] = state.cards.map((oneCard) => {
        //change 2 selected img´s to nonselected and hide
        if (oneCard.classNames.includes("selected_Div_img")) {
          return {
            ...oneCard,
            classNames: [
              ...oneCard.classNames.filter(
                (className) => className !== "selected_Div_img"
              ),
              "mask", // remove "selected" and add "mask" class
            ],
          }; 
        } else {
          //if img wasn´t selected -> nothing to change
          return oneCard; 
        }
      });

      let shuffledUnMatchedCards = afterUnMatchArr;
      
      //  if level is medium, shuffle only divs with class 'mask'

      if (action.payload === "medium") {
        shuffledUnMatchedCards = _shuffleUnMatchedCards(afterUnMatchArr);
       
      }

      state.cards = shuffledUnMatchedCards;
    },
    match: (state) => {

      // when 2 revealed pictures are same
      const afterMatchArr: My_Type_Card_Obj[] = state.cards.map((oneCard) => {
        //remove selected and add rotate -> change 2 selected img´s to nonselected and hide
        if (oneCard.classNames.includes("selected_Div_img")) {
          return {
            ...oneCard,
            classNames: [
              ...oneCard.classNames.filter(
                (className) => className !== "selected_Div_img"
              ),
              "rotate-center",
            ] as My_Type_ClassNames[],
          }; 
        } else {
          //if img wasn´t selected -> nothing to change
          return oneCard; 
        }
      });

      state.cards = afterMatchArr;
    },
 
    remove_after_match: (state) => {
      const afterAnimationMatchArr: My_Type_Card_Obj[] = state.cards.map(
        (oneCard) => {
          // remove selected and add rotate class -> change 2 selected img´s to nonselected and hide
          if (oneCard.classNames.includes("rotate-center")) {
            return {
              ...oneCard,
              classNames: [
                ...oneCard.classNames.filter(
                  (className) => className !== "rotate-center"
                ),
                "disabled",
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
    // the game is over after all imgs has been removed
    end_game: (state) => {
      
      state.isRunning = false;
      state.linkName = "game_page.link_end_game";
      state.isEnd = true;
    },
    // after_settings_selected_img_count: (state, action) => {
    create_cards_arr: (state, action) => {

      state.cards = action.payload;
      // state.isLoading=false; //---------------------------------------------maybe for the future to test this  !!!!!!
    },
    //evrytime we return on settings page
    reset_settings: (state) => {
      state.level = "" as My_Type_Level;
      state.selectedImgCount = 0 as My_Type_ImgCount;
      state.isRunning = false;
      state.isEnd = false;
      state.theme = "defaultTheme";
    },
    //after set the settings (but before clicking to start button)
    settings_and_styling_before_start: (state, action) => {

      /*using dynamic object properties*/
      const levelChanges: Record<My_Type_Level, My_Type_Theme> = {
        easy: "defaultTheme",
        medium: "mediumTheme",
        hard: "hardTheme",
      };

      //state.isEnd=false;//----------------------------------------------------maybe this could be decommented .. in case of problems in the future
      state.level = action.payload.level;
      state.selectedImgCount = action.payload
        .selectedImgCount as My_Type_ImgCount;
      state.theme = levelChanges[
        action.payload.level as My_Type_Level
      ] as My_Type_Theme;
    },
    //after fetching names from db
    // set_img_names: (state, action) => {
    //   state.imgNames = action.payload;
    // },
    
    //after loading imgs (in app.tsx)
    set_loading: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  set_start_game,
  set_loading,
  // set_img_names,
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