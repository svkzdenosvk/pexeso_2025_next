'use client';
//pulse button
import { css } from "styled-components";

 import { keyframes } from "@mui/system";

export const pulseShadow = keyframes`
  0% { box-shadow: 0 2px 0px white; }
  50% { box-shadow: 0 6px 10px goldenrod; }
  100% { box-shadow: 0 2px 0px white; }
`;

export const pulsatingButtonStyles = {
  textAlign: "center",
  textDecoration: "none",
  width: "50%",
  border: "none",
  background: "transparent",
  color: "black",
  margin: "10px auto",
  fontWeight: "bold",
  padding: "10px 25px",
  display: "inline",
  borderRadius: "25px",
  animation: `${pulseShadow} 1.5s infinite ease-in-out`,
  "&:hover": {
    color: "goldenrod",
    transition: "color 0.3s ease",
    boxShadow: "0px 7px 10px grey",
  },
};
//navLinks
export const sharedNavLinkStyles = {
  textAlign: "center",
  padding: "20px",
  color: "white",
  backgroundColor: "#808080",
  fontSize: "20px",
  fontWeight: "bold",
  textDecoration: "none",
  outline: "none",
  boxShadow: "none",
  border: "none",
  transition:
    "color 0.3s ease, background-color 0.3s ease, transform 0.3s ease",

  "&:hover": {
    color: "goldenrod",
    backgroundColor: "#696969",
    textDecoration: "none",
    outline: "none",
    border: "none",
    boxShadow: "0px 4px 8px rgba(255, 165, 0, 0.3)",
  },
} as const;

//-----------------------------------------------------------------------------------------
//--------------------------styled comp

// //navLinks
// export const sharedNavLinkStyles = css`
//   text-align: center;
//   padding: 20px;
//   color: white;
//   background-color: #808080;
//   font-size: 20px;
//   font-weight: bold;
//   text-decoration: none;
//   outline: none;
//   box-shadow: none;
//   border: none;
//   transition: color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;

//   &:hover {
//     color: goldenrod;
//     background-color: #696969;
//     text-decoration: none;
//     outline: none;
//     border: none;
//     box-shadow: 0px 4px 8px rgba(255, 165, 0, 0.3);
//   }
// `;

//--------------------------shared styles in themes
export const sharedThemeStyles = {
  typography: {
    h1: {
      fontFamily: '"Times New Roman", serif',
      textAlign: "center" as const,
      fontSize: 'calc(2rem + 5vw)',
   
    },
    h2: {
      fontFamily: '"Times New Roman", serif',
      textAlign: "center" as const,
    },
    h3: {
      fontFamily: '"Times New Roman", serif',
      textAlign: "center" as const,
    },
    h4: {
      fontFamily: '"Times New Roman", serif',
      // textAlign: "center" as const,          //h4 in rules component not need to align left
    },
    h5: {
      fontFamily: '"Times New Roman", serif',
      textAlign: "center" as const,
    },
    h6: {
      fontFamily: '"Times New Roman", serif',
      textAlign: "center" as const,
    },
  },
};
