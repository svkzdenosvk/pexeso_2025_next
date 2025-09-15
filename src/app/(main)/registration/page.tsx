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
} from '@pexeso/_inc/functions/registerRelated';
import { registerErrorMap } from '@pexeso/_inc/constants';
import { registerAction } from '@pexeso/app/actions/registerAction';

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

// ---------- Component

/**
 * RegisterFormWrapper
 *
 * Wrapper component for the registration page.
 * - Restricts route to unauthenticated users (`PublicOnlyRoute`)
 * - Wraps form in Suspense with fallback UI (`MySuspense`)
 *
 * @component
 * @route /register
 * @client
 * @dependencies React, MUI, i18next, Next.js
 */
export default function RegisterFormWrapper() {
  const { t } = useTranslation();

  return (
    <PublicOnlyRoute>
      {/* Suspense wrapper with fallback loading text  */}
      <MySuspense loadingText="loading_alerts.registration">
        <RegisterForm />
      </MySuspense>
    </PublicOnlyRoute>
  );
}

/**
 * RegisterForm
 *
 * Main component handling registration flow:
 * - Manages local state (form inputs, errors, password visibility, loading)
 * - Performs client-side validation via `validateRegistration`
 * - Calls `registerAction` for server-side registration
 * - Maps backend error codes via `registerErrorMap`
 * - Shows error alerts or redirects on success
 * - Resets game settings when mounted (`useResetSettings`)
 *
 * @component
 * @client
 * @dependencies React, MUI, i18next, Next.js
 */
function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter(); // next.js navigation

  // Local form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [error, setError] = useState(''); // stores translation key for i18n error
  const [showPassword, setShowPassword] = useState(false); // password visibility
  const [isLoading, setIsLoading] = useState(false);

  // Reset game settings when entering registration page
  useResetSettings();

  // Utility: clear form after successful registration
  const resetForm = () =>
    setForm({ name: '', email: '', password: '', confirm: '' });

   /**
   * handleRegisterSubmit
   *
   * Handles full registration workflow:
   * 1. Runs client-side validation
   * 2. Calls server action for registration
   * 3. Maps backend errors to translation keys (via `registerErrorMap`)
   * 4. Resets form & redirects on success
   */
  const handleRegisterSubmit = async () => {
    // --- Step 1: Client-side validation
    const validationError = validateRegistration(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    // --- Step 2: Attempt registration via server action
    const res = await registerAction(form);

     // --- Step 3: Handle backend error response
     if ('error' in res) {
    const rawError = res.error ?? 'reg_page.error_alert.reg_failed';
    setError(registerErrorMap[rawError] ?? 'reg_page.error_alert.unexpected');
    setIsLoading(false);
    return;
  }

    // --- Step 4: Success → reset form + redirect
    resetForm();
    router.push('/login?fromRegister=true');

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
          onClick={handleRegisterSubmit}
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
