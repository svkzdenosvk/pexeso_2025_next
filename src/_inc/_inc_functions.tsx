// ---------------------------
// ---------------------------file with included functions to make cleaner and more readable code
// ---------------------------


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

/*----------------------------------------------------------------------------------------*/
import type { My_Type_Card_Obj } from "./my_types";

// shuffle unmatched pexeso cards wth class 'mask'
export function _shuffleUnMatchedCards(afterUnMatchArr: My_Type_Card_Obj[]) {
  // array of 'mask' divs
  const maskCards = afterUnMatchArr.filter((div) =>
    div.classNames.includes("mask")
  );

  // shuffle mask divs
  const shuffled = _shuffleArray(maskCards);

  // new array where 'mask' divs are replaced with shuffled 'mask'
  let shuffledIndex = 0;
  afterUnMatchArr = afterUnMatchArr.map((div) => {
    if (div.classNames.includes("mask")) {
      return shuffled[shuffledIndex++];
    } else {
      return div;
    }
  });

  return afterUnMatchArr;
}

//  /*-------function for time formating from seconds  */

export function _myFormatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minPart = minutes > 0 ? `${minutes}m ` : "";
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

//----------------------------typeGuard functions for typescript
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
