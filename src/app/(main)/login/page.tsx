'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setUser } from '@pexeso/lib/redux/store/reducers/authSlice';

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

const LoginPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  //local state for form, errors, loading and successful log in
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  //show success message if we came from registration page
  useEffect(() => {
    if (searchParams.get('fromRegister')) {
      setShowSuccess(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('fromRegister');
      router.replace(url.toString()); // delete query parameter without reloading the page
    }
  }, [searchParams, router]);

  // login handler function
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      //send POST request to API
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      //show error if response not ok
      if (!res.ok) {
        setError(data.error || 'login_page.error_alert.unknow_err');
        return;
      }

      //setup/save user in redux
      dispatch(
        setUser({
          uid: data.user.uid,
          name: data?.name ?? '',
          email: data.user.email ?? '',
        })
      );

      //redirect to home page
      router.push('/');
    } catch (err) {
      setError('login_page.error_alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // my wrapper PublicOnly will be added
    <Box sx={{ mx: 'auto' }}>
      {/* show green success message after registration without problem */}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('login_page.success_login')}
        </Alert>
      )}

      {/* form */}
      <Box sx={sxStyles.form}>
        {/* input for email */}
        <TextField
          label={t('reg_page.label.email')}
          sx={sxStyles.input}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />

        {/* input for password */}
        <TextField
          label={t('reg_page.label.pass_conf')}
          type={showPassword ? 'text' : 'password'}
          sx={sxStyles.input}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* error alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(error)}
          </Alert>
        )}

        {/* login button */}
        <Button
          sx={{ px: 1, py: 2, fontWeight: 'bold' }}
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {t('login_page.btn_login')}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
