import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { create_cards_arr } from "@pexeso/lib/redux/store/reducers/gameSlice";
import { createCardsArray } from "@pexeso/_inc/functions/gameRelated";
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
} from "@pexeso/_inc/functions/general";
import type { RootState } from "@pexeso/lib/redux/store/store";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";

/**
 * useGameInit Hook
 *
 * Initializes the game on first render:
 * - Validates level and selected image count
 * - Redirects to `/settings` if invalid
 * - Creates shuffled cards array and dispatches it into Redux
 *
 * @hook
 * @returns void (side effects only)
 *
 * @dependencies
 * - Next.js router (redirect)
 * - Redux (dispatch game state)
 * - helper functions: `createCardsArray`, type guards
 */
export const useGameInit = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { imgNames, level, selectedImgCount } = useSelector(
    (state: RootState) => state.game
  );

  useEffect(() => {
    // Validate level and selected image count
    if (
      !my_Type_Guard_function(level, ["easy", "medium", "hard"]) ||
      !my_Type_Guard_function_number(selectedImgCount, [5, 6, 7, 8])
    ) {
      router.push("/settings");
      return;
    }

    // Create shuffled cards from chosen images
    const cards: My_Type_Card_Obj[] = createCardsArray(selectedImgCount, imgNames);

    // Store cards in Redux
    dispatch(create_cards_arr(cards));
  }, [level, selectedImgCount, router, dispatch, imgNames]);
};
