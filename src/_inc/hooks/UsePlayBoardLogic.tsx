// hooks/usePlayBoardLogic.ts
import { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  match,
  un_match,
  hardest_level_shuffle,
  showOne,
} from "@pexeso/lib/redux/store/reducers/gameSlice";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";

/**
 * usePlayBoardLogic Hook
 *
 * Handles the main game logic for the play board:
 * - Detects when two cards are selected and checks for a match.
 * - Dispatches Redux actions (`match`, `un_match`) based on result.
 * - On hardest level, continuously reshuffles cards with an interval.
 *
 * @hook
 * @param {My_Type_Card_Obj[]} cards - Array of card objects from Redux state.
 * @param {string} level - Current difficulty level ("easy", "medium", "hard").
 *
 * @returns {object} { revealCard } - Function to reveal a card on click.
 *
 * @dependencies
 * - Redux (`dispatch`, gameSlice actions)
 * - Browser timers (`setTimeout`, `setInterval`)
 *
 * @example
 * ```tsx
 * usePlayBoardLogic(cards, level);
 * ```
 *
 * @remarks
 * - Ensures timers are always cleared to prevent memory leaks.
 * - Delays match check by 200ms for card flip animation.
 * - Hard mode reshuffles cards every 400ms until cleanup.
 */

export const usePlayBoardLogic = (cards: My_Type_Card_Obj[], level: string) => {
  const dispatch = useDispatch();

  // Timer refs (persist across renders)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized selected cards → recalculates only when cards change
  const selectedCards = useMemo(
    () => cards.filter((c) => c.classNames.includes("selected_Div_img")),
    [cards]
  );

  // Memoized card reveal handler
  const revealCard = useCallback(
    (element: HTMLDivElement, divObject: My_Type_Card_Obj) => {
      if (
        element.classList.contains("mask") &&
        (selectedCards.length === 0 || selectedCards.length === 1)
      ) {
        dispatch(showOne(divObject));
      }
    },
    [selectedCards, dispatch]
  );

  useEffect(() => {
    // Clear previous timeout (avoid multiple overlapping executions)
    if (timeoutRef.current) clearTimeout(timeoutRef.current); //Chat GPT advice -> only one is enough
    if (intervalRef.current) clearInterval(intervalRef.current); //DeepSeek advice, but maybe not needed .. testing performance

    // --- CASE 1: Card matching logic (after small delay for animations)
    timeoutRef.current = setTimeout(() => {
      if (selectedCards.length === 2) {
        if (selectedCards[0].name === selectedCards[1].name) {
          dispatch(match()); // Cards match
        } else {
          dispatch(un_match(level)); // Cards do not match → reset selection
        }
      }

      // Re-enable pointer events after evaluation
      document.body.style.pointerEvents = "auto";
    }, 200);

    // --- CASE 2: Hardest level reshuffling ---
    if (level === "hard") {
      intervalRef.current = setInterval(() => {
        dispatch(hardest_level_shuffle());
      }, 400);
    }
    // --- Cleanup on dependency change/unmount ---
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current); // not needed as help from ChatGPT, but in reality maybe it helps
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, selectedCards, level]); // selectedCards namiesto cards

  // Return reveal function as a part of hook
  return { revealCard };
};