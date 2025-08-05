import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './reducers/gameSlice';
import secondsReducer from './reducers/secondsSlice';
import authReducer from './reducers/authSlice';
import { matchRemovalMiddleware } from '@pexeso/lib/redux/middlewares/matchRemovalMiddleware';

/**
 * The Redux store combines all state slices and middleware.
 *
 * Reducers:
 * - game: handles game logic (matching, shuffling, etc.)
 * - time: counts seconds (used for timers or time tracking)
 * - auth: user login/logout state
 *
 * Middleware:
 * - matchRemovalMiddleware: after a successful match, handles image hiding, game end check, etc.
 */

export const store = configureStore({
  reducer: {
    game: gameReducer,
    time: secondsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Extend default middleware with custom logic
    getDefaultMiddleware().concat(matchRemovalMiddleware),
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>; // Global state type
export type AppDispatch = typeof store.dispatch; // Dispatch type for async actions or thunks
