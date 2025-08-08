'use client';

import { useEffect, useState, Suspense } from 'react';
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
import { verifyClientOrigin } from '@pexeso/_inc/data';
import PublicOnlyRoute from '@pexeso/components/LoginReg/PublicOnlyRoute';
import MySuspense from '@pexeso/components/_internal/MySuspense';

// ---------- Sx styles

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

/**
 * Login Page Wrapper
 *
 * LoginFormWrapper is a protected wrapper for the login page.
 * - Ensures route is only accessible to unauthenticated users (`PublicOnlyRoute`)
 * - Uses Suspense with fallback UI while loading (`MySuspense`)
 *
 * @component
 * @route /login
 * @client
 * @dependencies React, MUI, i18next, Next.js, Redux
 */

// ---------- Component

export default function LoginFormWrapper() {
  const { t } = useTranslation();

  return (
    <PublicOnlyRoute>
      {/* Fallback loading alert while content is resolving */}
      <MySuspense loadingText="loading_alerts.login">
        <LoginForm />
      </MySuspense>
    </PublicOnlyRoute>
  );
}

/**
 * LoginForm
 *
 * This is the main login component responsible for:
 * - Handling email and password input
 * - Showing/hiding password
 * - Validating origin
 * - Sending POST request to login API
 * - Handling login errors
 * - Displaying success alert if redirected from registration
 * - Saving user to Redux and navigating to home
 *
 * @component
 * @client
 * @dependencies React, MUI, i18next, Redux, Next.js
 */

// ---------- Component

const LoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Local state for form data, visibility, errors, loading and success alert
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Show success alert after redirect from registration page
   */
  useEffect(() => {
    if (searchParams.get('fromRegister')) {
      setShowSuccess(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('fromRegister');
      router.replace(url.toString()); // Remove query parameter without reloading the page
    }
  }, [searchParams, router]);

  /**
   * Handle login logic
   *
   * Steps:
   * - Check origin
   * - Send login credentials to API
   * - Handle and map errors using i18n keys
   * - On success, save user to Redux store
   * - Redirect to home page
   */
  const handleLogin = async () => {
    // Validate origin to prevent unauthorized requests
    if (!verifyClientOrigin()) {
      setError('invalid_origin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Send POST request to API
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      // Mapping error code / alert for i18n
      const errorMap: Record<string, string> = {
        invalid_credentials: 'login_page.error_alert.invalid_credentials',
        missing_credentials: 'login_page.error_alert.missing_credentials',
        too_many_req: 'login_page.error_alert.too_many_req',
        login_failed: 'login_page.error_alert.login_failed',
        unknown_err: 'login_page.error_alert.unknown_err',
        not_allowed_origin: 'invalid_origin',
      };

      if (!res.ok) {
        const translatedKey =
          errorMap[data.error] || 'reg_page.error_alert.unexpected';
        setError(translatedKey);
        return;
      }

      // Save authenticated user to Redux
      dispatch(
        setUser({
          uid: data.user.uid,
          name: data?.name ?? '',
          email: data.user.email ?? '',
        })
      );

      // Redirect to home page
      router.push('/');
    } catch (err) {
      setError('login_page.error_alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mx: 'auto' }}>
      {/* Show green success message after registration without problem */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('login_page.success_login')}
        </Alert>
      )}

      {/* Login form UI */}
      <Box sx={sxStyles.form}>
        {/* Input for email */}
        <TextField
          label={t('reg_page.label.email')}
          sx={sxStyles.input}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />

        {/* Input for password with toggle visibility */}
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

        {/* Error alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(error)}
          </Alert>
        )}

        {/* Login button with loader */}
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
