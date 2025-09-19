'use client';

import { useState } from 'react';
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
import PublicOnlyRoute from '@pexeso/components/LoginReg/PublicOnlyRoute';
import MySuspense from '@pexeso/components/_internal/MySuspense';
import { useResetSettings } from '@pexeso/_inc/hooks/UseResetSettings';
import {
  validateRegistration,
  handleRegister,
} from '@pexeso/_inc/functions/registerRelated';

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

/**
 * RegisterFormWrapper
 *
 * RegisterFormWrapper is a protected wrapper for the registration page.
 * - Ensures the route is accessible only to unauthenticated users (`PublicOnlyRoute`)
 * - Uses a Suspense fallback (`MySuspense`) while loading
 *
 * @component
 * @route /register
 * @client
 * @dependencies React, MUI, i18next, next/navigation
 */

// ---------- Component
export default function RegisterFormWrapper() {
  const { t } = useTranslation();

  return (
    <PublicOnlyRoute>
      {/* Suspense wrapper with fallback loading text */}
      <MySuspense loadingText="loading_alerts.registration">
        <RegisterForm />
      </MySuspense>
    </PublicOnlyRoute>
  );
}

/**
 * RegisterForm
 *
 * Main component handling user registration:
 * - Manages local state (form inputs, visibility, errors, loading)
 * - Validates fields before submission
 * - Calls handleRegister() to send request & process errors
 * - Displays error alerts when validation or API fails
 * - On success → resets form and redirects to login
 *
 * @component
 * @client
 * @dependencies MUI, i18next, Next.js router
 */

//----Component
function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter(); // next.js navigation
  const searchParams = useSearchParams();

  // Local form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); //password visibility
  const [isLoading, setIsLoading] = useState(false);

  // Reset game settings when entering registration page
  useResetSettings();

  // Utility to clear form after successful registration
  const resetForm = () =>
    setForm({ name: '', email: '', password: '', confirm: '' });

  // Handle register button click
  const onRegister = async () => {
    // Validate fields before sending request
    const validationError = validateRegistration(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Call API handler with form data & state handlers
    await handleRegister({
      form,
      setError,
      setIsLoading,
      resetForm,
      router,
    });
  };

  return (
    <Box sx={sxStyles.form}>
      <fieldset
        disabled={isLoading}
        style={{ border: 0, padding: 0, margin: 0 }}
      >
        {/* Input for user name */}
        <TextField
          label={t('reg_page.label.name')}
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        {/* Input for email */}
        <TextField
          label={t('reg_page.label.email')}
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        {/* Input for password with toggle visibility */}
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

        {/* Password confirmation */}
        <TextField
          label={t('reg_page.label.pass_conf')}
          type="password"
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
        />

        {/* Error alert  */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(error) !== error ? t(error) : error}
          </Alert>
        )}

        {/* Registration/Submit button with loader*/}
        <Button
          variant="contained"
          fullWidth
          onClick={onRegister}
          disabled={isLoading}
          sx={{ px: 1, py: 2, fontWeight: 'bold' }}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {t('reg_page.btn_reg')}
        </Button>
      </fieldset>
    </Box>
  );
}
