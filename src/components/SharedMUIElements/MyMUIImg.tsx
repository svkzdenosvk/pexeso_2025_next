import React from "react";
import { Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';


interface MyMUIImgProps {
  src: string;
  sx: SxProps<Theme>;
}

//my version of MUI img

export const MyMUIImg = ({ src, sx }: MyMUIImgProps) => {
 
  return (
    
    <Box
      component="img"
      src={src}
      alt="Pexeso img"
      sx={sx}
    />
      
  );
};