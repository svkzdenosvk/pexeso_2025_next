import React from "react";
import { Typography, Box } from "@mui/material";
import { MyMUIButton } from "@pexeso/components/SharedMUIElements/MyMUIButton";
import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";

const ErrorPage = () => {
  return (
    <Box>
      <Typography variant="h3" component="h3">
        {" "}
        {/*originally h1 */}
        Error, táto stránka neexistuje
      </Typography>
      <MyMUIButton sx={pulsatingButtonStyles} to="/">
        Klikni sem a poď na hlavnú stránku
      </MyMUIButton>
    </Box>
  );
};

export default ErrorPage;
