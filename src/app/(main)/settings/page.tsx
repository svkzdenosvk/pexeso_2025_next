'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  settings_and_styling_before_start,
  reset_settings,
} from '@pexeso/lib/redux/store/reducers/gameSlice';
import { seconds_reset } from '@pexeso/lib/redux/store/reducers/secondsSlice';
import {
  My_Type_ImgCount,
  My_Type_Level,
  My_Type_Svk_Eng_level,
} from '@pexeso/_inc/my_types';
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
} from '@pexeso/_inc/_inc_functions';
import { pulsatingButtonStyles } from '@pexeso/components/StylingComp/SharedStyles';

// ---------- sx styles

const formStyles = {
  textAlign: 'center',
  mx: 'auto',
  mt: 2,
};

const fieldsetStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const alertStyles = {
  borderRadius: '25px',
  padding: '15px 25px',
  fontWeight: 'bold',
  justifyContent: 'center',
  textAlign: 'center',
  '& .MuiAlert-message': {
    width: '100%',
    textAlign: 'center',
  },
};

// ---------- component

const GameSettingsPage = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname(); 
  const formRef = useRef<HTMLFormElement>(null);

  const [levelChosen, setLevelChosen] = useState('' as My_Type_Level);
  const [imgCountChosen, setImgCountChosen] = useState(0 as My_Type_ImgCount);
  const [error, setError] = useState('');

  //reset level and img count
  useEffect(() => {
    dispatch(seconds_reset());
    dispatch(reset_settings());
  }, [pathname, dispatch]);

  //variables for automation in form
  const imgCountValues: My_Type_ImgCount[] = [5, 6, 7, 8];
  const levels: My_Type_Svk_Eng_level[] = [
    { value: 'easy', label: t('settings_page.level.easy') },
    { value: 'medium', label: t('settings_page.level.medium') },
    { value: 'hard', label: t('settings_page.level.hard') },
  ];
  const levelValues: My_Type_Level[] = ['easy', 'medium', 'hard'];

  //on submit function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //alert - level was NOT set 
    if (!my_Type_Guard_function(levelChosen, levelValues)) {
      setError( 'settings_page.error_alert.level');
      return;
    }
    //alert - img count was NOT set 
    if (!my_Type_Guard_function_number(imgCountChosen, imgCountValues)) {
      setError( 'settings_page.error_alert.img_count');
      return;
    }

    //if not error -> set level and img count and styling based on them
    setError('');
    dispatch(
      settings_and_styling_before_start({
        level: levelChosen,
        selectedImgCount: imgCountChosen,
      })
    );

    //after successful settings reset form
    formRef.current?.reset();
    router.push('/game'); //redirect
  };

  return (
    <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={formStyles}>
      <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
        {t('settings_page.h5')}
      </Typography>

      {/*form to choose level */}
      <FormControl sx={fieldsetStyles}>
        <FormLabel component="legend">
          {' '}
          {t('settings_page.legend.level')}
        </FormLabel>
        <RadioGroup
          row
          name="level"
          onChange={(e) => setLevelChosen(e.target.value as My_Type_Level)}
        >
          {levels.map((lvl, i) => (
            <FormControlLabel
              key={i}
              value={lvl.value}
              control={<Radio />}
              label={lvl.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/*form to choose img count */}
      <FormControl sx={fieldsetStyles}>
        <FormLabel component="legend">
          {t('settings_page.legend.img_count')}
        </FormLabel>
        <RadioGroup
          row
          name="imageCount"
          onChange={(e) =>
            setImgCountChosen(parseInt(e.target.value) as My_Type_ImgCount)
          }
        >
          {imgCountValues.map((cnt, i) => (
            <FormControlLabel
              key={i}
              value={cnt.toString()}
              control={<Radio />}
              label={`${cnt * 2}`} /* *2 -> pair of images */
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/*show error alerts if exist */}
      {error && (
        <Alert severity="error" sx={alertStyles}>
          {t(error)}
        </Alert>
      )}

      {/*submit button*/}
      <Button sx={pulsatingButtonStyles} type="submit">
        {t('settings_page.btn_play')}
      </Button>
    </Box>
  );
};

export default GameSettingsPage;
