'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import PublicOnlyRoute from '@pexeso/components/LoginReg/PublicOnlyRoute';
import MySuspense from '@pexeso/components/_internal/MySuspense';
import { useResetSettings } from '@pexeso/_inc/hooks/UseResetSettings';
import { useRegistrationSuccess } from '@pexeso/_inc/hooks/UseRegistrationSuccess';
import { useLoginMutation } from '@pexeso/lib/redux/services/authApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// ---------- Sx styles

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

/**
 * LoginFormWrapper
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
 * Main login form component:
 * - Manages local state (email, password, password visibility)
 * - Calls RTK Query `useLoginMutation` for authentication
 * - Maps API errors to i18n translation keys for user-friendly alerts
 * - On success:
 *    → resets game settings (`useResetSettings`)
 *    → redirects to the home page
 * - Displays success alert after redirect from registration (`useRegistrationSuccess`)
 *
 * @component
 * @client
 * @dependencies React, MUI, i18next, Redux, Next.js
 */

type AuthErrorResponse = {
  error: string;
};

// Mapping error code / alert for i18n
const loginErrorMap: Record<string, string> = {
  invalid_credentials: 'login_page.error_alert.invalid_credentials',
  missing_credentials: 'login_page.error_alert.missing_credentials',
  too_many_req: 'login_page.error_alert.too_many_req',
  login_failed: 'login_page.error_alert.login_failed',
  unknown_err: 'login_page.error_alert.unknown_err',
  not_allowed_origin: 'invalid_origin',
};

// ---------- Component

const LoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const [translatedError, setTranslatedError] = useState('');

  // Local state for form inputs, visibility, error, loading
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Reset game settings by own hook
  useResetSettings();

  // Show success alert after redirect from registration
  const showSuccess = useRegistrationSuccess();

  /**
   * Submit handler:
   *
   * - Triggers login() mutation
   * - unwrap():
   *    → on success → redirect to '/'
   *    → on failure → logs error (UI alert is handled by error state)
   */
  const onSubmit = async () => {
    // --- Step 1: Client-side validation (email format)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setTranslatedError('reg_page.error_alert.email_format');
      return;
    }

    try {
      await login({ email: form.email, password: form.password }).unwrap();
      router.push('/');
    } catch (err: any) {
      
      // Translate API error codes to i18n strings
      const fbqError = err as FetchBaseQueryError;
      if (fbqError?.data && typeof fbqError.data === 'object') {
        const errData = fbqError.data as AuthErrorResponse;
        if (errData?.error) {
          const myTranslatedError =
            loginErrorMap[errData.error] || 'reg_page.error_alert.unexpected';
          setTranslatedError(myTranslatedError);
          return;
        }
      }
    }
  };

  return (
    <Box sx={{ mx: 'auto' }}>
      <fieldset
        disabled={isLoading}
        style={{ border: 0, padding: 0, margin: 0 }}
      >
        {/* Success alert after registration redirect */}
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
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
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
          {/* {error && ( */}
          {translatedError.length > 1 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t(translatedError)}
            </Alert>
          )}

          {/* Login button with loader */}
          <Button
            sx={{ px: 1, py: 2, fontWeight: 'bold' }}
            variant="contained"
            fullWidth
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
            onClick={onSubmit}
          >
            {' '}
            {t('login_page.btn_login')}
          </Button>
        </Box>
      </fieldset>
    </Box>
  );
};
