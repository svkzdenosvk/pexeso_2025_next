'use client';

import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import ReusableImageBox from '@pexeso/components/SharedComponents/ReusableImageBox';

/**
 * Rules Page
 *
 * Displays the game rules, including general principles and difficulty levels.
 *
 * Features:
 * - Localized headings and texts using i18next
 * - Explains the core principle: finding matching image pairs hidden behind the joker card
 * - Lists three difficulty levels: Easy, Medium, and Hard — each with distinct gameplay behavior
 * - Dynamically renders level data using mapped translation entries
 * - Responsive layout styled with MUI components
 * - Includes a themed illustrative image (joker)
 *
 * @component
 * @client
 * @dependencies React, MUI, i18next, next/image
 *
 * @remarks
 * This page is part of the "About Game" section and is available at `/about-game/rules`.
 * The difficulty settings influence the image behavior during gameplay:
 *  - Easy: Images don’t shuffle; matched pairs disappear and the rest shift together
 *  - Medium: Images shuffle after every failed attempt
 *  - Hard: Images shuffle almost continuously *
 * @example
 * Route: `app/about-game/rules/page.tsx`
 */

// ---------- Sx styles

// Main container style for the rules page – vertical layout and global font size
const rulesContentStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  p: 0,
  m: 0,
  boxSizing: 'border-box',
  fontSize: '20px',
} as const;

// Wrapper for the main text content – left aligned with padding
const rulesMainContentStyles = {
  textAlign: 'left',
  padding: '2%',
} as const;

// Section layout for the gameplay principle – image and text side by side
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

// Wrapper for difficulty levels list
const rulesLevelSectionStyles = {
  lineHeight: '150%',
} as const;

// Unordered list styling
const ulListStyles = {
  listStyleType: 'none',
  paddingLeft: '2%',
  '@media (max-width:1105px)': {
    paddingLeft: '0%',
  },
} as const;

// List item styling – adds custom bullet symbol and indentation
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

// Image container styling – used for the joker image in the principle section
const imgStyles = {
  width: '200px',
  height: '130px',
  marginRight: '2%',
  position: 'relative',
  borderRadius: 2,
  overflow: 'hidden',
} as const;

// Paragraph styling for principle text – with responsive max width and indentation
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

// ---------- component

const Rules = () => {
  const { t } = useTranslation();

  // ---------- Localized data for difficulty levels

  const levelsSectionData = [
    {
      name: t('rules_page.content.level.name.easy'),
      description: t('rules_page.content.level.description.easy'),
    },
    {
      name: t('rules_page.content.level.name.medium'),
      description: t('rules_page.content.level.description.medium'),
    },
    {
      name: t('rules_page.content.level.name.hard'),
      description: t('rules_page.content.level.description.hard'),
    },
  ];

  return (
    <Box sx={rulesContentStyles}>
      {/* Page heading */}
      <Typography variant="h2" component="h2">
        {' '}
        {t('rules_page.h2')}
      </Typography>
      <Box sx={rulesMainContentStyles}>
        {/* Section: Game principle */}
        <Typography variant="h4" component="h4">
          {' '}
          {t('rules_page.h4.principle')}
        </Typography>
        <Box sx={rulesPrincipleSectionStyles}>
          {/* Paragraph with game principle description */}
          <Typography component="p" sx={pStyles}>
            {t('rules_page.content.principle')}
          </Typography>

          {/* Illustrative image (Joker card) */}
          <ReusableImageBox sx={imgStyles} imageName="joker" />

        </Box>

        {/* Section: Difficulty levels */}
        <Typography variant="h4" component="h4">
          {' '}
          {t('rules_page.h4.level')}
        </Typography>
        <Box sx={rulesLevelSectionStyles}>
          {/* Dynamically rendered list of game levels */}
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
