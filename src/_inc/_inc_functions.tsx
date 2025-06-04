// ---------------------------
// ---------------------------file with included functions to make cleaner and more readable code
// ---------------------------

// ---------------------------axios client (something like fetcher in swr)
import axios from 'axios';

export const _axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------function for shuffle

export function _shuffleArray(arrayIn: any[]) {
  /*-------------------------------------------------partial f. to shuffle random positions in array stolen from : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array  (EDIT: Updating to ES6 / ECMAScript 2015) */

  let array = [...arrayIn];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

//  /*-------function for time formating from seconds  */

export function _myFormatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minPart = minutes > 0 ? `${minutes}m ` : '';
  const secPart = `${remainingSeconds}s`;

  return minPart + secPart;
}

// ---------------------------function for toggle of classes

export function _myToggle(
  elm: HTMLElement,
  removedClass: string,
  addedClass: string
) {
  elm.classList.add(addedClass);
  elm.classList.remove(removedClass);
}

//----------------------------function for typescript
export function my_Type_Guard_function<My_Type extends string>(
  value: string,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}

export function my_Type_Guard_function_number<My_Type extends number>(
  value: number,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}
