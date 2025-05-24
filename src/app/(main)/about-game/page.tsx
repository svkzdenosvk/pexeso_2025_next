'use client';
import React from "react";
import { Typography, Box } from "@mui/material";

// ---------- component

const AboutGame = () => {
  return (
    <Box sx={{  mx: "auto"}}>
      <Typography variant="h2" component="h2" >
        {" "}
        {/*originally h1 */}O hre pexeso
      </Typography>
      <div className="img"></div>
    </Box>
    
  );
};

export default AboutGame;