import { createSlice } from "@reduxjs/toolkit";

//---------------redux toolkit

const secondsSlice = createSlice({
  name: "time",
  initialState: { seconds: 0 },
  reducers: {
    seconds_counter: (state) => {
      state.seconds += 1;
    },
    seconds_reset: (state) => {
      state.seconds = 0;
    },
  },
});

export const { seconds_counter, seconds_reset } = secondsSlice.actions;
export default secondsSlice.reducer;
