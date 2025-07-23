import type { Middleware } from "@reduxjs/toolkit";
import {
  remove_after_match,
  match,
  end_game,
} from "@pexeso/lib/redux/store/reducers/gameSlice";

export const matchRemovalMiddleware: Middleware<unknown> =
  (storeAPI) => (next) => (action) => {
    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      action.type === match.type
    ) {
      //firstly trigger match action
      next(action); 

      void document.body.offsetHeight;

       setTimeout(() => {
      //after match -> hide pictures 
      storeAPI.dispatch(remove_after_match()); 

      const state = storeAPI.getState();
      const allImgs = state.game.divImgs;

      const disabledImgs = document.getElementsByClassName("disabled");
     
      // when all images are removed -> the game is over
      if (allImgs.length === disabledImgs.length+2) {
        
        storeAPI.dispatch(end_game());
      }
       }, 200);
    } else {
      next(action);
    }
  };