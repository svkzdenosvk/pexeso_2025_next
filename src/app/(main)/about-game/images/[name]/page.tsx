'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Typography, Box } from '@mui/material';
import { RootState } from '@pexeso/redux/store/store';
import { my_Type_Guard_function } from '@pexeso/_inc/_inc_functions';
import { MyMUIButton } from '@pexeso/components/SharedMUIElements/MyMUIButton';
import { MyMUIImg } from '@pexeso/components/SharedMUIElements/MyMUIImg';
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';

// ---------- sx styles

const singleImgContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
} as const;

const singleImgMainContentStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
} as const;

const errorStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
} as const;

const imgStyles = {
  width: '200px',
  height: '200px',
} as const;

// ---------- component

const SingleImagePage = () => {
  const { name } = useParams(); // z Next.js hooku
  const { imgNames } = useSelector((state: RootState) => state.game);

  const [errorImgName, setErrorImgName] = useState(false);
  const [imgNameH1, setNameH1] = useState('');

  useEffect(() => {
    if (!name || typeof name !== 'string') {
      setErrorImgName(true);
      setNameH1('Neexistujúci obrázok');
      return;
    }

    if (!my_Type_Guard_function(name, imgNames)) {
      setErrorImgName(true);
      setNameH1('Neexistujúci obrázok');
    } else {
      setErrorImgName(false);
      let displayName = name;

      // Lokalizované výnimky
      if (name === 'vesmir') displayName = 'vesmír';
      if (name === 'vibracia') displayName = 'vibrácia';

      setNameH1(displayName);
    }
  }, [name, imgNames]);

  return (
    <Box sx={singleImgContentStyles}>
      <Typography variant="h3" component="h3">
        {imgNameH1.charAt(0).toUpperCase() + imgNameH1.slice(1)}
      </Typography>

      <Box sx={singleImgMainContentStyles}>
        {errorImgName ? (
          <Box sx={errorStyles}>
            <Typography variant="h3" component="h3">
              Error, tento obrázok neexistuje
            </Typography>
            <MyMUIButton sx={pulsatingButtonStyles} to="/about-game/images">
              Klikni sem a poď na stránku obrázkov
            </MyMUIButton>
          </Box>
        ) : (
          <>
            <MyMUIImg sx={imgStyles} src={`/pictures/pexeso/${name}.jpg`} />
            <MyMUIButton sx={pulsatingButtonStyles} to="/about-game/images">
              Späť na stránku obrázkov
            </MyMUIButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SingleImagePage;
