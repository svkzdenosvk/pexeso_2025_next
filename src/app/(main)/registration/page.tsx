'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, projectUsers } from '@pexeso/lib/firebase/firestoreConfigUsers';

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

export default function RegisterForm() {

const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const { password, confirm, name, email } = form;
    if (name.length < 3) return 'reg_page.error_alert.name_length_min';
    if (name.length > 50) return 'reg_page.error_alert.name_length_max';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'reg_page.error_alert.email_format';
    if (password.length < 6 || password.length > 20)
      return 'reg_page.error_alert.pass_length';
    if (!/[A-Z]/.test(password)) return 'reg_page.error_alert.pass_upper';
    if (!/[!@#$%^&*-]/.test(password))
      return 'reg_page.error_alert.pass_special';
    if (password !== confirm) return 'reg_page.error_alert.pass_confirm';
    return '';
  };

 const handleRegister = async () => {
  setIsLoading(true);
  setError('');

  const validationError = validate();
  if (validationError) {
    setError(validationError);
    setIsLoading(false);
    return;
  }

  try {
    const res = await fetch('/api/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'reg_page.error_alert.unexpected');
      return;
    }

    setForm({ name: '', email: '', password: '', confirm: '' });
    router.push('/login?fromRegister=true');
  } catch (err) {
    setError('reg_page.error_alert.unexpected');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box sx={sxStyles.form}>
      <TextField
        label={t('reg_page.label.name')}
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <TextField
        label={t('reg_page.label.email')}
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />
      <TextField
        label={t('reg_page.label.pass')}
        type={showPassword ? 'text' : 'password'}
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label={t('reg_page.label.pass_conf')}
        type="password"
        sx={sxStyles.input}
        onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t(error)}
        </Alert>
      )}
      <Button
        variant="contained"
        fullWidth
        onClick={handleRegister}
        disabled={isLoading}
        sx={{ px: 1, py: 2, fontWeight: 'bold' }}
        startIcon={isLoading && <CircularProgress size={20} />}
      >
        {t('reg_page.btn_reg')}
      </Button>
    </Box>
  );
}
