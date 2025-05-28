'use client';

import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import Image from 'next/image';
// import { MyMUIImg } from "@pexeso/components/SharedMUIElements/MyMUIImg";

// ---------- sx styles

const rulesContentStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  p: 0,
  m: 0,
  boxSizing: 'border-box',
  fontSize: '20px',
} as const;

const rulesMainContentStyles = {
  textAlign: 'left',
  padding: '2%',
} as const;

const rulesPrincipleSectionStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  lineHeight: '150%',
  '@media (max-width:1339px)': {
    justifyContent: 'space-evenly',
  },
  '@media (max-width:1105)': {
    justifyContent: 'start',
  },
} as const;

const rulesLevelSectionStyles = {
  lineHeight: '150%',
} as const;

const ulListStyles = {
  listStyleType: 'none',
  paddingLeft: '2%',
  '@media (max-width:1105px)': {
    paddingLeft: '0%',
  },
} as const;

const liListStyles = {
  // marginBottom: "2%",
  width: '90%',
  position: 'relative',
  paddingLeft: '1.5em',
  '&::before': {
    content: '"✽\\00a0\\00a0\\00a0\\00a0"',
    position: 'absolute',
    left: 0,
  },
} as const;

const imgStyles = {
  width: '200px',
  height: '130px',
  marginRight: '2%',
  position: 'relative',
  borderRadius: 2,
  overflow: 'hidden',
} as const;

const pStyles = {
  marginRight: '5%',
  textIndent: '10%',
  maxWidth: '40%',
  '@media (max-width:1105px)': {
    maxWidth: '60%',
  },
  '@media (max-width:994px)': {
    marginRight: '2%',
    maxWidth: '60%',
  },
  '@media (max-width:902px)': {
    marginRight: '0%',
  },
  '@media (max-width:860px)': {
    marginRight: '5%',
    maxWidth: '50%',
  },
  '@media (max-width:750px)': {
    maxWidth: '40%',
    marginRight: '3%',
  },
} as const;

// ---------- data for section - level

const levelsSectionData = [
  {
    name: 'Ľahký',
    description:
      'Obrázky sa nemiešajú, ale uhádnuté sa vymažú a zvyšné sa posúvajú k sebe.',
  },
  {
    name: 'Stredný',
    description:
      'Usporiadanie obrázkov sa mieša po každej neuhádnutej dvojici.',
  },
  {
    name: 'Ťažký',
    description: 'Usporiadanie obrázkov sa mieša takmer každú sekundu.',
  },
];
// ---------- component

const Rules = () => {
  return (
    <Box sx={rulesContentStyles}>
      <Typography variant="h2" component="h2">
        {' '}
        {/*originally h1 */}
        Pravidlá
      </Typography>
      <Box sx={rulesMainContentStyles}>
        <Typography variant="h4" component="h4">
          {' '}
          {/*originally h2 */}
          Princíp
        </Typography>
        <Box sx={rulesPrincipleSectionStyles}>
          <Typography component="p" sx={pStyles}>
            Hľadať zhodný pár obrázkov pod obrázkom jokera.
          </Typography>
          <Box sx={imgStyles}>
            <Image
              src={`/pictures/joker.jpg`}
              alt={`Obrázok joker`}
              fill
              style={{ objectFit: 'cover' }} // this is needed because of "fill"
            />
          </Box>
        </Box>
        <Typography variant="h4" component="h4">
          {' '}
          {/*originally h2 */}
          Nastavenie levelu obtiažnosti
        </Typography>
        <Box sx={rulesLevelSectionStyles}>
          {/* automatization */}
          <List sx={ulListStyles}>
            {levelsSectionData.map((level, index) => (
              <ListItem key={index} sx={liListStyles}>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>{level.name}</strong> – {level.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Rules;
