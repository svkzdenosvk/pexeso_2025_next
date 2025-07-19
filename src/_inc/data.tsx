// import { projectFirestore } from "../lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { _shuffleArray } from "./_inc_functions";
import { My_Type_Img_Name, My_Type_ImgCount, My_Type_DivImg } from "./my_types";

const uuid = require("uuid");

// export async function fetchOnlyImgNames() {
//   //-----------------------------fun. to fetch img names from db
//   let arrImg: My_Type_Img_Name[] = []; //---------------------------------- create empty array -> it will be filled with img´s names

//   try {
//     // ---------------------------------------------------------------------loading docs from Firebase

//     const snapshot = await getDocs(
//       collection(projectFirestore, "pexeso-img-names"),
//     );
//     snapshot.forEach((doc) => {
//       const name: My_Type_Img_Name = doc.data().name;

//       if (name) {
//         arrImg.push(name); //-----------------------------------------------add name to array
//       }
//     });
//   } catch (error) {
//     console.error("Chyba pri načítaní dát z Firestore:", error);
//     return []; // ----------------------------------------------------------if error return empty array
//   }

//   return arrImg;
// }

export async function createDivsArrayFromImgNamesAndCountImg(
  selectedCountOfImg: My_Type_ImgCount,
  imgNamesInFunc: My_Type_Img_Name[],
) {
  let shuffledImgNamesArray = _shuffleArray(imgNamesInFunc); //--------------shuffle to randomize order of all received picture

  let afterCutArrImg = shuffledImgNamesArray.slice(0, selectedCountOfImg); //to cut selected count of pictures

  const doubleImgs = [...afterCutArrImg, ...afterCutArrImg];

  let shuffledImgNamesPairsArray = _shuffleArray(doubleImgs); //-------------to shuffle before every game

  //creation of 2-dimensional array: - out of component to make id´s stable
  // ['123e4567-e89b-12d3-a456-426614174000', 'blesk'],
  // ['123e4567-e89b-12d3-a456-426614174001', 'kvapka'],..
  const imgsWithKeys = shuffledImgNamesPairsArray.map((pictureName) => [
    uuid.v4(),
    pictureName,
  ]);

  let divItems: My_Type_DivImg[] = imgsWithKeys.map(([id, pictureName]) => ({
    //-array of objects: img {name,id, classes} -> div>img
    id: id,
    name: pictureName,
    classNames: ["mask", "div_on_click"],
  }));

  return divItems; // ------------------------------------------------------return final array
}

export function preloadImages(imgNamesArr: My_Type_Img_Name[]) {
  //---------function during loading images
  return Promise.all(
    imgNamesArr.map((picture) => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = "/pictures/pexeso/" + picture + ".jpg";
        img.onload = async () => {
          try {
            await img.decode();      // waiting for decoding :contentReference[oaicite:3]{index=3}
            resolve(picture);
          } catch {
            reject(new Error(`Chyba dekódovania: ${picture}`));
          }
        };
        img.onerror = () => reject(new Error(`Chyba načítania: ${picture}`));
      });
    }),
  );
}

/*--------------------------------------------------------------------------------------------*/
// list of allowed origins (pages from POST req came)
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://pexeso-next.netlify.app'
] as const;

export type AllowedOrigin = typeof ALLOWED_ORIGINS[number];

//version for FE
export const verifyClientOrigin = (): boolean => {
  if (typeof window === 'undefined') return true; // Pre SSR
  
  const currentOrigin = window.location.origin;
  const isValid = ALLOWED_ORIGINS.includes(currentOrigin as AllowedOrigin);
  
  if (!isValid) {
    console.error(`Invalid origin: ${currentOrigin}`);
  }
  
  return isValid;
};

//version for BE (API)
export const verifyApiOrigin = (origin: string | null):  boolean  => {
  if (!origin) return  false;
  
  const isValid = ALLOWED_ORIGINS.includes(origin as AllowedOrigin);

  return isValid;
};