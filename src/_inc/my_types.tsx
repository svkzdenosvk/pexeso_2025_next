export type My_Type_Level = "easy" | "medium" | "hard";
export type My_Type_Level_Svk = "Ľahký" | "Stredný" | "Ťažký";

export type My_Type_Img_Name =
  | "blesk"
  | "drevo"
  | "kvapka"
  | "more"
  | "slnko"
  | "vesmir"
  | "vibracia"
  | "vietor";

export type My_Type_ImgCount = 5 | 6 | 7 | 8;

export type My_Type_Theme = "defaultTheme" | "mediumTheme" | "hardTheme";

export type My_Type_ClassNames =
  | "mask"
  | "selected_Div_img"
  | "rotate-center"
  | "div_on_click";

export type My_Type_Image = {
  id: string;
  name: My_Type_Img_Name;
};

export type My_Type_DivImg = My_Type_Image & {
  /*------------------------------div above img element  */
  classNames: My_Type_ClassNames[];
};

export type My_Type_Svk_Eng_level = {
  value: My_Type_Level;
  label: My_Type_Level_Svk;
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
  | { type: "SHOW_ONE"; payload: My_Type_DivImg }
  | { type: "UN_MATCH"; payload: My_Type_Level }
  | { type: "MATCH" }
  | { type: "REMOVE_AFTER_MATCH" }
  | { type: "AFTER_SETTINGS_SELECTED_IMG_COUNT"; payload: My_Type_DivImg[] }
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
    divImgs: My_Type_DivImg[];
    selectedImgCount: My_Type_ImgCount;
    level: My_Type_Level;
    theme: My_Type_Theme;
  };
  time: { seconds: number };
};
