/**
 * Global Type Definitions
 *
 * Centralized TypeScript types for game logic, UI, Redux, and authentication.
 * This file ensures type safety across the application by defining:
 * - Game levels, image names, themes, and card structure
 * - Redux action/state types for game and timer
 * - Authentication and user-related types
 *
 * @dependencies React (ReactNode), Redux
 */

// -------------------- Game Types --------------------

// Supported game difficulty levels
export type My_Type_Level = 'easy' | 'medium' | 'hard';

// Supported image names used in the game
export type My_Type_Img_Name =
  | 'lightning'
  | 'wood'
  | 'drop'
  | 'sea'
  | 'sun'
  | 'space'
  | 'vibration'
  | 'wind';

// Possible image counts per game (pairings x2)
export type My_Type_ImgCount = 5 | 6 | 7 | 8;

// Available theme identifiers for game styling
export type My_Type_Theme = 'defaultTheme' | 'mediumTheme' | 'hardTheme';

// CSS class names used for card states/animations
export type My_Type_ClassNames =
  | 'mask'
  | 'selected_Div_img'
  | 'rotate-center'
  | 'div_on_click'
  | 'disabled';

// Single image object with ID and name
export type My_Type_Image = {
  id: string;
  name: My_Type_Img_Name;
};

// Card object(div above img element) with image data and applied CSS classes
export type My_Type_Card_Obj = My_Type_Image & {
  classNames: My_Type_ClassNames[];
};

// Level object with English value and display label (localized)
export type My_Type_Svk_Eng_level = {
  value: My_Type_Level;
  label: string;
};

// -------------------- UI/React Types --------------------

import { ReactNode } from 'react';

// Props for a Suspense wrapper with optional loading text
export type My_Type_MySuspenseProp = {
  children: ReactNode;
  loadingText?: string;
};

// -------------------- Redux Types --------------------

// Redux game action types
export type My_Type_Redux_Game_Action =
  | { type: 'SET_START_GAME' }
  | { type: 'SET_STOP_GAME' }
  | {
      type: 'SET_LEVEL_AND_STYLING_AND_IMGCOUNT';
      payload: { level: My_Type_Level; imgCount: My_Type_ImgCount };
    }
  | { type: 'HARDEST_LEVEL_SHUFFLE' }
  | { type: 'SHOW_ONE'; payload: My_Type_Card_Obj }
  | { type: 'UN_MATCH'; payload: My_Type_Level }
  | { type: 'MATCH' }
  | { type: 'REMOVE_AFTER_MATCH' }
  | { type: 'AFTER_SETTINGS_SELECTED_IMG_COUNT'; payload: My_Type_Card_Obj[] }
  | { type: 'RESET_SETTINGS' }
  | {
      type: 'SETTINGS_AND_STYLING';
      payload: { level: My_Type_Level; selectedImgCount: My_Type_ImgCount };
    }
  | { type: 'SET_IMG_NAMES'; payload: My_Type_Img_Name[] }
  | { type: 'SET_LOADING' };

// Redux timer action types
export type My_Type_Redux_Seconds_Action =
  | { type: 'SECONDS_COUNTER' }
  | { type: 'SECONDS_RESET' };

// Redux timer state shape
export type My_Type_Redux_Seconds_State = {
  seconds: number;
};

// Redux root state shape
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

// -------------------- Auth Types --------------------

// Authenticated user object
export type My_Type_User = {
  uid: string;
  name: string;
  email: string;
};

// Authentication state shape
export type My_Type_AuthState = {
  user: My_Type_User | null;
};

// Error name as string for i18n
export type My_Type_ErrorResponse = {
  error: string;
};

// -------------------- Login Types --------------------

import type { AppDispatch } from "@pexeso/lib/redux/store/store";

export type My_Type_LoginParams = {
  email: string;
  password: string;
  dispatch: AppDispatch;
  setError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  navigation: () => void; // e.g., router.push('/')
};

// Login form credentials
export interface My_Type_Login {
  email: string;
  password: string;
}

// -------------------- Register Types --------------------

export type My_Type_RegistrationForm  = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

export type My_Type_RegisterParams  = {
  form: My_Type_RegistrationForm;
  setError: (msg: string) => void;
  setIsLoading: (state: boolean) => void;
  resetForm: () => void;
  router: any; // Next.js router
};