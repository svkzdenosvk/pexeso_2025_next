// hooks/useGameTimer.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { seconds_counter } from "@pexeso/lib/redux/store/reducers/secondsSlice";

/**
 * useGameTimer Hook
 *
  * Hook that increments game time in Redux every second
 * while the game is active.
 *
 * @hook
 * @returns void (side effects only)
 *
 * @dependencies
 * - Redux (game state, dispatch for seconds_counter)
 */
export const useGameTimer = () => {
  const dispatch = useDispatch();

  // Extract game status flags from Redux
  const { isRunning, isLoading, isEnd } = useSelector(
    (state: RootState) => state.game
  );

  useEffect(() => {
    // Start timer only if game is running, not loading, and not ended
    if (!isRunning || isLoading || isEnd) return;

    const interval = setInterval(() => {
      dispatch(seconds_counter()); // increment seconds every 1s
    }, 1000);

    // Cleanup on unmount or when dependencies change
    return () => clearInterval(interval);
  }, [isRunning, dispatch, isLoading, isEnd]);
};