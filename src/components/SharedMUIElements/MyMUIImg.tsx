import React from "react";
import { Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';


interface MyMUIImgProps {
  src: string;
  sx: SxProps<Theme>;
  alt?: string
}

//my version of MUI img

export const MyMUIImg = ({ src, sx, alt="Pexeso picture" }: MyMUIImgProps) => {
  
  return (
    
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={sx}
    />
      
  );
};