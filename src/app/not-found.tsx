import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';
import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';

// ---------- sx styles
const boxStyles = {
  mt: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  width: '100%',
} as const;

// ---------- component
const ErrorPage = () => {
  return (
    <Box sx={boxStyles}>
      <Typography variant="h3" component="h3">
        {' '}
        {/*originally h1 */}
        Error, táto stránka neexistuje
      </Typography>

      <Button
        component={NextLinkComposed}
        to="/"
        variant="contained"
        sx={pulsatingButtonStyles}
      >
        Klikni sem a poď na hlavnú stránku
      </Button>
    </Box>
  );
};

export default ErrorPage;
