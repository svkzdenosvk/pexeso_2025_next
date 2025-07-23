import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./reducers/gameSlice";
import secondsReducer from "./reducers/secondsSlice";
import authReducer from "./reducers/authSlice";
 import { matchRemovalMiddleware } from "@pexeso/lib/redux/middlewares/matchRemovalMiddleware";  

export const store = configureStore({
  reducer: {
    game: gameReducer,
    time: secondsReducer,
        auth: authReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(matchRemovalMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
