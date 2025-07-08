'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
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
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import { auth, projectUsers } from '@pexeso/lib/firebase/firestoreConfigUsers';
// Ak máš wrapper pre PublicOnlyRoute, môžeš ho zachovať, inak odstráň

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

const LoginPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const lang = (params.lang as string) || 'en'; // fallback language if not in URL

  useEffect(() => {
    if (searchParams.get('fromRegister')) {
      setShowSuccess(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('fromRegister');
      router.replace(url.toString()); // odstráni query bez reloadu
    }
  }, [searchParams, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'login_page.error_alert');
        return;
      }

      //setup user in redux
      dispatch(
        setUser({
          uid: data.user.uid,
          name: data?.name ?? '',
          email: data.user.email ?? '',
        })
      );

      router.push('/');
    } catch (err) {
      setError('login_page.error_alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Prípadne obal do vlastného PublicOnly wrapperu
    <Box sx={{ mx: 'auto' }}>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('login_page.success_login')}
        </Alert>
      )}

      <Box sx={sxStyles.form}>
        <TextField
          label={t('reg_page.label.email')}
          sx={sxStyles.input}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(error)}
          </Alert>
        )}
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
