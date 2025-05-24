import { Middleware } from "@reduxjs/toolkit";
import {
  remove_after_match,
  match,
  end_game,
} from "@pexeso/store/reducers/gameSlice";

export const matchRemovalMiddleware: Middleware<{}> =
  (storeAPI) => (next) => (action) => {
    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      action.type === match.type
    ) {
      next(action); // -----------------------------------------------------------firstly trigger match action

      void document.body.offsetHeight;

      setTimeout(() => {
        storeAPI.dispatch(remove_after_match()); //------------------------------after match -> remove pictures (it´s about animations)

        const state = storeAPI.getState();
        const arrayLength = state.game.divImgs.length;

        if (arrayLength === 0) {
          //---------------------------------------------when all images are removed
          storeAPI.dispatch(end_game());
        }
      }, 200);
    } else {
      next(action);
    }
  };
