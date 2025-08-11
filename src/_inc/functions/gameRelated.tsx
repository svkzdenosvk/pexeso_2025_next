/**
 * Game-Specific Utility Functions
 * -------------------------------
 * Helper functions used exclusively for the Pexeso game logic and setup.
 *
 * Purpose:
 *   - Encapsulate reusable game mechanics.
 *   - Keep core gameplay logic separate from UI components.
 *
 * Contents:
 *   - _shuffleUnMatchedCards() → Shuffles only unmatched (face-down) cards.
 *   - createCardsArray()       → Generates the complete set of cards for a game round.
 *   - showImg()                → Reveals a card based on game rules.
 *   - preloadImages()          → Preloads all game images for smooth gameplay.
 *
 * Usage:
 *   - Import these functions only in game-related components or services.
 *   - Not intended for generic utility use outside the game context.
 *
 */

import type {
  My_Type_Card_Obj,
  My_Type_Img_Name,
  My_Type_ImgCount,
} from '../my_types';
import { _shuffleArray } from './general';
import { showOne } from '@pexeso/lib/redux/store/reducers/gameSlice';
import type { AppDispatch } from '@pexeso/lib/redux/store/store';

const uuid = require('uuid');

/**
 * Shuffles only the unmatched (face-down) cards in the current game state.
 *
 * @param afterUnMatchArr - The full array of card objects.
 * @returns A new array where only cards with the "mask" class are shuffled.
 */
export function _shuffleUnMatchedCards(afterUnMatchArr: My_Type_Card_Obj[]) {
  // Filter out cards that are still face-down (class 'mask')
  const maskCards = afterUnMatchArr.filter((div) =>
    div.classNames.includes('mask')
  );

  // Shuffle the face-down cards
  const shuffled = _shuffleArray(maskCards);

  // Replace original face-down cards with their shuffled counterparts
  let shuffledIndex = 0;
  afterUnMatchArr = afterUnMatchArr.map((div) => {
    if (div.classNames.includes('mask')) {
      return shuffled[shuffledIndex++];
    } else {
      return div;
    }
  });

  return afterUnMatchArr;
}

/*--------------------------------------------------------------------------*/

/**
 * Creates an array of card objects for the Pexeso game.
 *
 * Steps:
 * 1. Randomizes the received image names.
 * 2. Selects the desired number of images based on the game settings.
 * 3. Duplicates the images to create pairs.
 * 4. Shuffles the paired images for random card placement.
 * 5. Assigns a unique UUID to each image to keep card IDs stable between renders.
 * 6. Wraps each card in an object containing its ID, name, and CSS classes.
 *
 * @param selectedCountOfImg - Number of unique images to use.
 * @param imgNamesInFunc - Full list of available image names.
 * @returns An array of card objects ready for rendering.
 */

export function createCardsArray(
  selectedCountOfImg: My_Type_ImgCount,
  imgNamesInFunc: My_Type_Img_Name[]
) {
  // Step 1: Shuffle to randomize the order of all received images
  let shuffledImgNamesArray = _shuffleArray(imgNamesInFunc);

  // Step 2: Cut the array to match the selected count of unique images
  let afterCutArrImg = shuffledImgNamesArray.slice(0, selectedCountOfImg);

  // Step 3: Duplicate the images to create matching pairs
  const doubleImgs = [...afterCutArrImg, ...afterCutArrImg];

  // Step 4: Shuffle again so the pairs are not next to each other
  let shuffledImgNamesPairsArray = _shuffleArray(doubleImgs);

  // Step 5: Create a 2D array with [UUID, imageName] for stable IDs across renders
  // Example: [ ['123e4567-e89b-12d3-a456-426614174000', 'blesk'], ... ]
  const imgsWithKeys = shuffledImgNamesPairsArray.map((pictureName) => [
    uuid.v4(),
    pictureName,
  ]);

  // Step 6: Convert into an array of card objects {name,id, classes}
  let cards: My_Type_Card_Obj[] = imgsWithKeys.map(([id, pictureName]) => ({
    id: id,
    name: pictureName,
    classNames: ['mask', 'div_on_click'],
  }));

  // Return the final array of card objects
  return cards;
}

/*--------------------------------------------------------------------------*/
/**
 * Reveals a hidden card if the game rules allow it.
 *
 * Steps:
 * 1. Identify currently selected cards (flipped but not yet matched).
 * 2. Identify cards currently rotating (in animation state).
 * 3. Check conditions:
 *    - Clicked card must still be masked (hidden).
 *    - There can be at most one already selected card.
 *    - No cards should currently be rotating.
 * 4. If all conditions pass, dispatch an action to reveal the clicked card.
 *
 * @param element - The clicked card's HTML container.
 * @param objectLikeCard - Card object containing ID, name, and CSS classes.
 * @param cards - Current array of all cards in the game.
 * @param dispatch - Dispatch from Redux

 */
export const showImg = (
  element: HTMLDivElement,
  objectLikeCard: My_Type_Card_Obj,
  cards: My_Type_Card_Obj[],
  dispatch: AppDispatch
) => {
  // Step 1: Find all selected (flipped) cards
  const selectedArr = cards.filter((oneCard) =>
    oneCard.classNames.includes('selected_Div_img')
  );

  // Step 2: Find all cards in rotation animation
  const rotatedArr = cards.filter((oneCard) =>
    oneCard.classNames.includes('rotate-center')
  );

  // Step 3: Only reveal if the card is masked, there is max 1 selected card, and no card is rotating
  if (
    element.classList.contains('mask') &&
    selectedArr.length <= 1 &&
    rotatedArr.length === 0
  ) {
    // Step 4: Dispatch action to reveal the clicked card
    dispatch(showOne(objectLikeCard));
  }
};

/*--------------------------------------------------------------------------*/

/**
 * Preloads all required images before the game starts to ensure smooth gameplay.
 *
 * @param imgNamesArr - Array of image names (without file extension).
 * @returns A Promise that resolves when all images are successfully loaded and decoded.
 */
export function preloadImages(imgNamesArr: My_Type_Img_Name[]) {
  return Promise.all(
    imgNamesArr.map((picture) => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        // Set image source path
        img.src = '/pictures/pexeso/' + picture + '.jpg';

        // When image loads, attempt to decode before resolving
        img.onload = async () => {
          try {
            await img.decode(); // Wait for decoding to finish
            resolve(picture);
          } catch {
            reject(new Error(`Chyba dekódovania: ${picture}`));
          }
        };

        // When image loads, attempt to decode before resolving
        img.onerror = () => reject(new Error(`Chyba načítania: ${picture}`));
      });
    })
  );
}

/* ========================================================================
 * 3) ORIGIN VALIDATION – Security checks for allowed origins
 * ======================================================================*/
