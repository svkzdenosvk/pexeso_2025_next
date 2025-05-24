import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { MyMUIButton } from "@pexeso/components/SharedMUIElements/MyMUIButton";
import { sharedNavLinkStyles } from "@pexeso/components/StylingComp/SharedStyles";

// ---------- sx styles

const sharedWrapperStyles = {
  p: 0,
  m: 0,
  boxSizing: "border-box",
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
} as const;

const sharedHeaderNavigation = {
  height: "30vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
} as const;

const navStyles = {
  display: "flex",
  width: "100%",
  backgroundColor: "#808080",
  "@media (max-width:436px)": {
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
  },
} as const;

const navLinkStyles = {
  width: "50%",

  "@media (max-width: 436px)": {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
} as const;

const mainContentStyles = {
  display: "flex",
  flexDirection: "row",
  minHeight: "100%",
  width: "100%",
    // justifyContent: "center",
  "@media (max-width:600px)": {
    flexDirection: "column",
  },
} as const;

// ---------- component

const SharedLayout = () => {
  return (
    <Box sx={sharedWrapperStyles}>
      <Box sx={sharedHeaderNavigation}>
        <Box sx={navStyles}>
          <MyMUIButton
            sx={[sharedNavLinkStyles, navLinkStyles]}
            to="/about-game"
          >
            O Hre
          </MyMUIButton>
          <MyMUIButton sx={[sharedNavLinkStyles, navLinkStyles]} to="/settings">
            Hraj hru
          </MyMUIButton>
        </Box>
      </Box>
      <Box sx={mainContentStyles}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default SharedLayout;
