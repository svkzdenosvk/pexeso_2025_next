export type My_Type_Level = "easy" | "medium" | "hard";
// export type My_Type_Level_Svk = "Ľahký" | "Stredný" | "Ťažký";

export type My_Type_Img_Name =
  | "lightning"
  | "wood"
  | "drop"
  | "sea"
  | "sun"
  | "space"
  | "vibration"
  | "wind";

export type My_Type_ImgCount = 5 | 6 | 7 | 8;

export type My_Type_Theme = "defaultTheme" | "mediumTheme" | "hardTheme";

export type My_Type_ClassNames =
  | "mask"
  | "selected_Div_img"
  | "rotate-center"
  | "div_on_click"
  | "disabled";

export type My_Type_Image = {
  id: string;
  name: My_Type_Img_Name;
};

export type My_Type_Card_Obj = My_Type_Image & {
  /*------------------------------div above img element  */
  classNames: My_Type_ClassNames[];
};

export type My_Type_Svk_Eng_level = {
  value: My_Type_Level;
  label: string;
};

import { ReactNode } from 'react';

export type My_Type_MySuspenseProp = {
  children: ReactNode;
  loadingText?: string;
};

/*----------------------------------------redux----------------------------------------- */

export type My_Type_Redux_Game_Action =
  | { type: "SET_START_GAME" }
  | { type: "SET_STOP_GAME" }
  | {
      type: "SET_LEVEL_AND_STYLING_AND_IMGCOUNT";
      payload: { level: My_Type_Level; imgCount: My_Type_ImgCount };
    }
  | { type: "HARDEST_LEVEL_SHUFFLE" }
  | { type: "SHOW_ONE"; payload: My_Type_Card_Obj }
  | { type: "UN_MATCH"; payload: My_Type_Level }
  | { type: "MATCH" }
  | { type: "REMOVE_AFTER_MATCH" }
  | { type: "AFTER_SETTINGS_SELECTED_IMG_COUNT"; payload: My_Type_Card_Obj[] }
  | { type: "RESET_SETTINGS" }
  | {
      type: "SETTINGS_AND_STYLING";
      payload: { level: My_Type_Level; selectedImgCount: My_Type_ImgCount };
    }
  | { type: "SET_IMG_NAMES"; payload: My_Type_Img_Name[] }
  | { type: "SET_LOADING" };

export type My_Type_Redux_Seconds_Action =
  | { type: "SECONDS_COUNTER" }
  | { type: "SECONDS_RESET" };

export type My_Type_Redux_Seconds_State = {
  seconds: number;
};

export type My_Type_Redux_Root_State = {
  game: {
    isLoading: boolean;
    isRunning: boolean;
    linkName: string;
    imgNames: My_Type_Img_Name[];
    isEnd: boolean;
    cards: My_Type_Card_Obj[];
    selectedImgCount: My_Type_ImgCount;
    level: My_Type_Level;
    theme: My_Type_Theme;
  };
  time: { seconds: number };
};

/*----------------------------------------auth----------------------------------------- */
export type My_Type_User = {
  uid: string;
  name: string;
  email: string;
}

export type My_Type_AuthState = {
  user: My_Type_User | null;
}

export interface My_Type_Login {
  email: string;
  password: string;
}
