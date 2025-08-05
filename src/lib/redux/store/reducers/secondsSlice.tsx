import { createSlice } from '@reduxjs/toolkit';

/**
 * This slice tracks elapsed time in seconds.
 * Typically used in games, quizzes, or any app that needs to measure how long something took.
 *
 * State:
 * - seconds: number – counts the number of seconds elapsed
 */

//---------------redux toolkit

const secondsSlice = createSlice({
  name: 'time', // slice name used in Redux state
  initialState: { seconds: 0 }, // initial timer starts at 0
  reducers: {
    /**
     * Increments the seconds counter by 1.
     * Should be called every 1 second (e.g. via setInterval or middleware).
     */
    seconds_counter: (state) => {
      state.seconds += 1;
    },

    /**
     * Resets the counter back to 0.
     * Useful when restarting or ending a game/quiz.
     */
    seconds_reset: (state) => {
      state.seconds = 0;
    },
  },
});

// Export individual actions
export const { seconds_counter, seconds_reset } = secondsSlice.actions;

// Export reducer to include in store
export default secondsSlice.reducer;
