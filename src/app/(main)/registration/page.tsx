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
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import PublicOnlyRoute from '@pexeso/components/LoginReg/PublicOnlyRoute';
import MySuspense from '@pexeso/components/_internal/MySuspense';
import { useResetSettings } from '@pexeso/_inc/hooks/UseResetSettings';
import {
  validateRegistration,
  handleAuthError,
} from '@pexeso/_inc/functions/loginRegRelated';
import { useRegisterMutation } from '@pexeso/lib/redux/services/authApi';
import { registerPageErrorMap } from '@pexeso/_inc/constants';

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
 * - Manages local form state (inputs, password visibility, translated errors)
 * - Validates inputs before submission (`validateRegistration`)
 * - Submits registration data via RTK Query (`useRegisterMutation`)
 * - Handles and translates backend errors (`FetchBaseQueryError` + `registerErrorMap`)
 * - Displays error messages or loading states
 * - On success → clears the form and redirects to `/login`
 *
 * @component
 * @client
 * @dependencies React, MUI, i18next, RTK Query, Next.js router
 */

//----Component
function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter(); // next.js navigation

  // State for toggling password visibility and submit state of form
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  // Translated error message (empty string means "no error")
  const [translatedError, setTranslatedError] = useState('');

  // RTK Query mutation hook for registration endpoint
  const [register, { isLoading, error }] = useRegisterMutation();

  // Reset game settings when entering registration page
  useResetSettings();

  /**
   * Handles registration submission.
   * 1. Validate fields locally
   * 2. Attempt to register via RTK Query mutation
   * 3. On success → reset form and redirect
   * 4. On failure → map backend error to translation key
   */
  const onRegister = async () => {
    //  Step 1: Validate form before sending the request
    const validationError = validateRegistration(form);
    if (validationError) {
      setTranslatedError(validationError);
      return;
    }

    try {
      setIsSubmitting(true); //  Start global submit state

      //  Step 2: Call API (RTK Query mutation)
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      //  Step 3: Success → redirect and reset form
      router.push('/login?fromRegister=true');
      setForm({ name: '', email: '', password: '', confirm: '' });
    } catch (err) {
      //  Step 4: Handle server-side errors
      handleAuthError(err, registerPageErrorMap, setTranslatedError);

      setIsSubmitting(false); // End submit state
    }
  };

  return (
    <Box sx={sxStyles.form}>
      <fieldset
        disabled={isSubmitting}
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
        {translatedError.length > 1 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(translatedError)}
          </Alert>
        )}

        {/* Registration/Submit button with loader*/}
        <Button
          variant="contained"
          fullWidth
          onClick={onRegister}
          disabled={isSubmitting}
          sx={{ px: 1, py: 2, fontWeight: 'bold' }}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {t('reg_page.btn_reg')}
        </Button>
      </fieldset>
    </Box>
  );
}
