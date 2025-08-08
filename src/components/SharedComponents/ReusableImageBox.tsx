'use client';

import React from 'react';
import Image from 'next/image';
import { Box, SxProps, Theme } from '@mui/material';

/**
 * ReusableImageBox Component
 *
 * Renders a responsive image inside a styled MUI Box using Next.js Image optimization.
 * Accepts a `sx` prop for container styling and an `imageName` (without extension)
 * to dynamically load images from `/pictures/pexeso/`.
 *
 * @component
 * @example
 * <ReusableImageBox sx={customStyles} imageName="joker" />
 *
 * @remarks
 * Ensures consistent `objectFit: cover` behavior for cropped images.
 *
 * @dependencies
 * React, Next.js (Image), MUI (Box)
 */

type Props = {
  sx: SxProps<Theme>; // MUI sx styling object for the wrapping Box
  imageName: string; // Image name without ".jpg"
};

const ReusableImageBox = ({ sx, imageName }: Props) => {
  return (
    <Box sx={sx}>   {/* Image container */}
      
      {/* Optimized Next.js image */}
      <Image
        src={`/pictures/pexeso/${imageName}.jpg`}
        alt={`Obrázok ${imageName}`}
        fill
        style={{ objectFit: 'cover' }} // this is needed because of "fill"
      />
    </Box>
  );
};

export default ReusableImageBox;
