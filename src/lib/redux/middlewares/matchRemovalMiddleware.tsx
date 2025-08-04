import type { Middleware } from '@reduxjs/toolkit';
import {
  remove_after_match,
  match,
  end_game,
} from '@pexeso/lib/redux/store/reducers/gameSlice';

/**
 * matchRemovalMiddleware
 *
 * Custom Redux middleware for handling game logic after a successful match.
 *
 * Features:
 * - Detects the `match` action
 * - Waits briefly before removing matched cards
 * - Checks if all cards are disabled to determine game end
 *
 * This middleware:
 * 1. Intercepts the `match` action
 * 2. Waits 200ms for visual feedback (flip animation)
 * 3. Dispatches `remove_after_match()` to hide matched cards
 * 4. Checks if all cards are disabled and dispatches `end_game()` if true
 *
 * @usage Automatically injected via Redux middleware pipeline
 * @dependencies Redux Toolkit, DOM access (document.getElementsByClassName)
 */

export const matchRemovalMiddleware: Middleware<unknown> =
  (storeAPI) => (next) => (action) => {
    if (
      typeof action === 'object' &&
      action !== null &&
      'type' in action &&
      action.type === match.type
    ) {
      // 1. Trigger match action
      next(action);

      // 2. Force reflow to ensure animations apply correctly
      void document.body.offsetHeight;

      // 3. Wait for a short delay (for visual feedback)
      setTimeout(() => {
        // 4. Hide matched cards
        storeAPI.dispatch(remove_after_match());

        // 5. Determine if the game has ended
        const state = storeAPI.getState();
        const allImgs = state.game.cards;

        const disabledImgs = document.getElementsByClassName('disabled');

        // When all images are removed -> the game is over
        if (allImgs.length === disabledImgs.length + 2) {
          storeAPI.dispatch(end_game());
        }
      }, 200);
    } else {
      next(action); // Pass through all other actions
    }
  };
