'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Typography, Box } from '@mui/material';
import { RootState } from '@pexeso/redux/store/store';
import Link from 'next/link';
import styled from 'styled-components';
import   {keyframes } from "styled-components";

import { my_Type_Guard_function } from '@pexeso/_inc/_inc_functions';
import { MyMUIImg } from '@pexeso/components/SharedMUIElements/MyMUIImg';

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

// const errorStyles = {
//   height: '100%',
//   width: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-evenly',
//   alignItems: 'center',
// } as const;

const imgStyles = {
  width: '200px',
  height: '200px',
} as const;

// ---------- styled comp

//pulsating button
const pulseShadowComp = keyframes`
  0% { box-shadow: 0 2px 0px white; }
  50% { box-shadow: 0 6px 10px goldenrod; }
  100% { box-shadow: 0 2px 0px white; }
`;

 const StyledNextBtnBackLink = styled(Link)`
  text-align: center;
  text-decoration: none;
  width: 50%;
  border: none;
  background: transparent;
  color: black;
  margin: 10px auto;
  font-weight: bold;
  padding: 10px 25px;
  display: inline;
  border-radius: 25px;
  cursor: pointer;
  animation: ${pulseShadowComp} 1.5s infinite ease-in-out;
  
  &:hover {
    color: goldenrod;
    transition: color 0.3s ease;
    box-shadow: 0px 7px 10px grey;
  }
`;

// ---------- component

const SingleImagePage = () => {
  console.log('useParams()', useParams());

 const params = useParams();
const name = typeof params?.name === 'string' ? params.name : undefined;

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
      let displayName:string = name;

      // exceptions
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
        <>
          
            <Typography variant="h3" component="h3">
              Error, tento obrázok neexistuje
            </Typography>
              <StyledNextBtnBackLink href="/about-game/images"> Klikni sem a poď na stránku obrázkov</StyledNextBtnBackLink>
           
          </>
        ) : (
          <>
            <MyMUIImg sx={imgStyles} src={`/pictures/pexeso/${name}.jpg`} />
             <StyledNextBtnBackLink href="/about-game/images"> Späť na stránku obrázkov</StyledNextBtnBackLink>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SingleImagePage;
