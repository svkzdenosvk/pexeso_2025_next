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

const uuid = require('uuid');

/**
 * Shuffles only the unmatched (face-down) cards in the current game state.
 *
 * Workflow:
 * 1. Extract all cards that are still face-down (class 'mask').
 * 2. Shuffle only these cards while keeping matched cards in place.
 * 3. Reinsert shuffled cards back into their original positions.
 *
 * @param afterUnMatchArr - The full array of card objects.
 * @returns A new array where only cards with the "mask" class are shuffled.
 */

export function _shuffleUnMatchedCards(afterUnMatchArr: My_Type_Card_Obj[]) {
  // ---------- 1. Filter out cards that are still face-down (class 'mask')
  const maskCards = afterUnMatchArr.filter((div) =>
    div.classNames.includes('mask')
  );

  // ---------- 2. Shuffle the face-down cards
  const shuffled = _shuffleArray(maskCards);

  // ---------- 3. Replace original face-down cards with their shuffled counterparts
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
 * Workflow:
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
 * Preloads all required images before the game starts to ensure smooth gameplay.
 *
 * Workflow:
 * 1. Create a new Image() element for each image name.
 * 2. Set the correct file path and begin loading.
 * 3. Wait for the image to load and decode before resolving.
 * 4. Reject the Promise if decoding or loading fails.
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


