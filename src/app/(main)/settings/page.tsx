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
import {
  settings_and_styling_before_start,
  reset_settings,
} from '@pexeso/redux/store/reducers/gameSlice';
import { seconds_reset } from '@pexeso/redux/store/reducers/secondsSlice';
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
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname(); // ekvivalent k useLocation().pathname
  const formRef = useRef<HTMLFormElement>(null);

  const [levelChosen, setLevelChosen] = useState('' as My_Type_Level);
  const [imgCountChosen, setImgCountChosen] = useState(0 as My_Type_ImgCount);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(seconds_reset());
    dispatch(reset_settings());
  }, [pathname, dispatch]);

  const imgCountValues: My_Type_ImgCount[] = [5, 6, 7, 8];
  const levels: My_Type_Svk_Eng_level[] = [
    { value: 'easy', label: 'Ľahký' },
    { value: 'medium', label: 'Stredný' },
    { value: 'hard', label: 'Ťažký' },
  ];
  const levelValues: My_Type_Level[] = ['easy', 'medium', 'hard'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!my_Type_Guard_function(levelChosen, levelValues)) {
      setError('Nastav level obtiažnosti');
      return;
    }

    if (!my_Type_Guard_function_number(imgCountChosen, imgCountValues)) {
      setError('Nastav počet obrázkov, s ktorými chceš hrať.');
      return;
    }

    setError('');

    dispatch(
      settings_and_styling_before_start({
        level: levelChosen,
        selectedImgCount: imgCountChosen,
      })
    );

    formRef.current?.reset();
    router.push('/game'); //redirect
  };

  return (
    <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={formStyles}>
      <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
        Nastavte parametre hry
      </Typography>

      <FormControl sx={fieldsetStyles}>
        <FormLabel component="legend">Vyberte úroveň obtiažnosti:</FormLabel>
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

      <FormControl sx={fieldsetStyles}>
        <FormLabel component="legend">Vyberte počet obrázkov:</FormLabel>
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
              label={`${cnt * 2}`}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {error && (
        <Alert severity="error" sx={alertStyles}>
          {error}
        </Alert>
      )}

      <Button sx={pulsatingButtonStyles} type="submit">
        Hraj
      </Button>
    </Box>
  );
};

export default GameSettingsPage;
