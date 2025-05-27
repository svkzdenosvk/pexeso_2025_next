'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@pexeso/redux/store/store';
import { Typography, Box ,Button} from '@mui/material';

import NextLinkComposed from '@pexeso/components/SharedNextElements/NextLinkComposed';

// ---------- sx styles

const imgContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
} as const;

const imgMainContentStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  gap: '1%',
};

const btnLinkStyles = {
  backgroundColor: 'white',
  textDecoration: 'none',
  outline: 'none',
  boxShadow: 'none',
  border: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
} as const;

const imgStyles = {
  transition: 'box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0px 0px 28px 19px goldenrod',
  },
} as const;
// ---------- styled components
// const StyledImageLink = styled(Link)`
//   background-color: white;
//   text-decoration: none;
//   outline: none;
//   box-shadow: none;
//   border: none;

//   &:hover {
//     box-shadow: none;
//   }
// `;
// ---------- component

const Images = () => {
  const { isLoading, imgNames } = useSelector((state: RootState) => state.game);

  return (
    <Box sx={imgContentStyles}>
      <Typography variant="h2" component="h2">
        Hracie obrázky
      </Typography>

      <Box sx={imgMainContentStyles}>
        {isLoading || imgNames.length === 0 ? (
          <Typography variant="h4" component="h4">
            Načítavajú sa obrázky
          </Typography>
        ) : (
          imgNames.map((oneImgName) => (
           
            <Button
              component={NextLinkComposed}
              key={oneImgName}
              to={`/about-game/images/${oneImgName}`}
              sx={btnLinkStyles}
            >
              <Box
                component="img"
                src={`/pictures/pexeso/${oneImgName}.jpg`}
                alt={`Obrázok ${oneImgName}`}
                sx={imgStyles}
              />
            </Button>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Images;
