'use client';

import { useState } from 'react';
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
import PublicOnlyRoute from '@pexeso/components/LoginReg/PublicOnlyRoute';
import MySuspense from '@pexeso/components/_internal/MySuspense';
import { useResetSettings } from '@pexeso/_inc/hooks/UseResetSettings';
import { useRegistrationSuccess } from '@pexeso/_inc/hooks/UseRegistrationSuccess';
import { loginSubmit } from '@pexeso/_inc/functions/loginRelated';

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
 * Main component handling login flow:
 * - Manages local state (form, visibility, errors, loading)
 * - Renders inputs for email & password (with toggle visibility)
 * - Displays error or success alerts
 * - Resets game settings via hook
 * - Delegates login workflow to `handleLoginSubmit` (validates, calls server, updates Redux, redirects)
 *
 * @component
 * @client
 * @dependencies React, MUI, i18next, Redux, Next.js
 */

// ---------- Component

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Local state for form inputs, visibility, error, loading
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset game settings by own hook
  useResetSettings();

  // Show success alert after redirect from registration
  const showSuccess = useRegistrationSuccess();

  /**
   * handleSubmit
   *
   * Local wrapper for the shared login handler:
   * - Clears error state and shows loading indicator
   * - Calls `handleLoginSubmit` with form data and Redux dispatch
   * - Applies returned error key to local state (if any)
   * - Always resets loading state after execution
   */
  async function handleLoginSubmit() {
    setError('');
    setIsLoading(true);

    const errorKey = await loginSubmit({
      email: form.email,
      password: form.password,
      dispatch,
    });

    if (errorKey) {
      setError(errorKey);
      setIsLoading(false);
    }

  }
  return (
    <Box sx={{ mx: 'auto' }}>
      {/* Success alert after registration redirect */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('login_page.success_login')}
        </Alert>
      )}

      {/* Login form UI */}
      <Box sx={sxStyles.form}>
        <fieldset
          disabled={isLoading}
          style={{ border: 0, padding: 0, margin: 0 }}
        >
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
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
            onClick={handleLoginSubmit}
          >
            {' '}
            {t('login_page.btn_login')}
          </Button>
        </fieldset>
      </Box>
    </Box>
  );
};
