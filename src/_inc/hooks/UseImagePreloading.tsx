import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { preloadImages } from "@pexeso/_inc/functions/gameRelated";
import { set_loading } from "@pexeso/lib/redux/store/reducers/gameSlice";
import type { RootState } from "@pexeso/lib/redux/store/store";

/**
 * useImagePreloading Hook
 *
 * Preloads all game images before gameplay starts.
 * Runs automatically when the `isLoading` flag in Redux is true.
 *
 * @hook
 * @returns void (side effects only)
 *
 * @dependencies
 * - Redux (game state: `isLoading`, `imgNames`, dispatch for `set_loading`)
 * - `preloadImages` helper function
 *
 * @remarks
 * - On success: dispatches `set_loading()` to mark images as loaded.
 * - On failure: reloads the page to retry (simple fallback strategy).
 */
export const useImagePreloading = () => {
  const dispatch = useDispatch();
  const { isLoading, imgNames } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    if (!isLoading) return;

    // Attempt to preload all images
    preloadImages(imgNames)
      .then(() => {
        // Set loading to false after imgs were loaded
        dispatch(set_loading());
      })
      .catch((err) => {
        // setError(err.message);    // save error message / or show message ..hm
        console.log("Not all images were loaded", err);
        // setLoadingImg(false);        //-----------------------------------------set loading to false

        // Reload page for simple retry logic on error
        window.location.reload();
      });
  }, [isLoading, imgNames, dispatch]);
};