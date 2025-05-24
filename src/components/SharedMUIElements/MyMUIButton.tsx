'use client';

import React from 'react';
import NextLink from 'next/link';
import { Button } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface MyMUIButtonProps {
  to?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  sx?: SxProps<Theme>;
}

// My version of MUI Button for Next.js
export const MyMUIButton = ({ to, children, sx, type = 'button' }: MyMUIButtonProps) => {
  if (to) {
    return (
      <NextLink href={to} passHref>
        <Button  variant="contained" sx={sx}>
          {children}
        </Button>
      </NextLink>
    );
  }

  return (
    <Button type={type} variant="contained" sx={sx}>
      {children}
    </Button>
  );
};
