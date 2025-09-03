// hooks/useResetSettings.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { reset_settings } from "@pexeso/lib/redux/store/reducers/gameSlice";
import { seconds_reset } from "@pexeso/lib/redux/store/reducers/secondsSlice";

/**
 * useResetSettings Hook
 *
 * Hook that resets game settings and timer on mount.
 *
 * @hook
 * @returns void (side effect only)
 * @dependencies React, Redux
 */
export const useResetSettings = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(seconds_reset()); // reset game timer
    dispatch(reset_settings()); // reset game configuration
    
  }, [dispatch]);
};