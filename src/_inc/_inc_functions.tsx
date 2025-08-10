// ========================================================================
// utils.ts – Shared Utility Functions
// 
// Purpose:
// This file consolidates helper functions into one place for better
// maintainability and organization. It includes:
// 
// 1) Generic utilities – reusable across the project
// 2) Game-specific utilities – functions tailored to the Pexeso game logic
// 3) Origin validation – security checks for allowed origins
//
// Benefits:
// - All helper logic in a single, structured file
// - Clear separation between generic and game-specific code
// - Easier imports and code readability
// ========================================================================

import type { My_Type_Card_Obj, My_Type_Img_Name, My_Type_ImgCount } from "./my_types";
const uuid = require("uuid");

/* ========================================================================
 * 1) GENERIC UTILITIES – Reusable across the project
 * ======================================================================*/

/**
 * Randomly shuffles the elements of an array using the Fisher–Yates algorithm.
 *
 * @param arrayIn - The input array to shuffle.
 * @returns A new array with the elements in randomized order.
 *
 */

export function _shuffleArray(arrayIn: any[]) {
  // Copy array to avoid mutating the original
  let array = [...arrayIn];

  // Iterate from the last element backwards
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at positions i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/*--------------------------------------------------------------------------*/

/**
 * Formats a duration (in seconds) into a human-readable string.
 *
 * @param seconds - The total number of seconds.
 * @returns A string in the format "Xm Ys" or "Ys" if minutes are zero.
 */

export function _myFormatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minPart = minutes > 0 ? `${minutes}m ` : '';
  const secPart = `${remainingSeconds}s`;

  return minPart + secPart;
}

/*--------------------------------------------------------------------------*/

/**
 * Toggles CSS classes on a DOM element.
 *
 * @param elm - The target HTML element.
 * @param removedClass - The class name to remove.
 * @param addedClass - The class name to add.
 */

export function _myToggle(
  elm: HTMLElement,
  removedClass: string,
  addedClass: string
) {
  elm.classList.add(addedClass);
  elm.classList.remove(removedClass);
}

/*--------------------------------------------------------------------------*/

/**
 * Type guard for narrowing down string values to a specific string literal type.
 *
 * @param value - The string value to check.
 * @param arr - The readonly array of allowed string literal values.
 * @returns True if the value is included in the allowed list, false otherwise.
 */
export function my_Type_Guard_function<My_Type extends string>(
  value: string,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}

/*--------------------------------------------------------------------------*/

/**
 * Type guard for narrowing down numeric values to a specific numeric literal type.
 *
 * @param value - The numeric value to check.
 * @param arr - The readonly array of allowed numeric literal values.
 * @returns True if the value is included in the allowed list, false otherwise.
 */
export function my_Type_Guard_function_number<My_Type extends number>(
  value: number,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}

/* ========================================================================
 * 2) GAME-SPECIFIC UTILITIES – Tailored for Pexeso game logic
 * ======================================================================*/

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

/**
 * List of allowed origins (domains) from which POST requests can be accepted.
 * This is used both in the frontend and backend for security checks.
 */
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://pexeso-next.netlify.app',
] as const;

export type AllowedOrigin = (typeof ALLOWED_ORIGINS)[number];

/**
 * Frontend origin verification.
 * Checks whether the current browser origin is in the allowed list.
 *
 * @returns True if the origin is allowed, otherwise false.
 */
export const verifyClientOrigin = (): boolean => {
  if (typeof window === 'undefined') return true; // Allow during SSR (Server-Side Rendering)

  const currentOrigin = window.location.origin;
  const isValid = ALLOWED_ORIGINS.includes(currentOrigin as AllowedOrigin);

  if (!isValid) {
    console.error(`Invalid origin: ${currentOrigin}`);
  }

  return isValid;
};

/**
 * Backend (API) origin verification.
 * Checks if the provided origin header is in the allowed list.
 *
 * @param origin - The request origin (or null if not provided).
 * @returns True if the origin is allowed, otherwise false.
 */
export const verifyApiOrigin = (origin: string | null): boolean => {
  if (!origin) return false;

  const isValid = ALLOWED_ORIGINS.includes(origin as AllowedOrigin);

  return isValid;
};
