'use client';

import { useState, Suspense } from 'react';
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
import { verifyClientOrigin } from '@pexeso/_inc/functions/originValidation';
import PublicOnlyRoute from '@pexeso/components/LoginReg/PublicOnlyRoute';
import MySuspense from '@pexeso/components/_internal/MySuspense';

const sxStyles = {
  input: { mb: 2, width: '100%' },
  form: { maxWidth: 400, mx: 'auto', mt: 4 },
};

/**
 * Register Page Wrapper
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
      {/* Fallback loading alert while content is resolving */}
      <MySuspense loadingText="loading_alerts.registration">
        <RegisterForm />
      </MySuspense>
    </PublicOnlyRoute>
  );
}

/**
 * RegisterForm
 *
 * This is the core UI component for user registration.
 * - Handles form input state
 * - Validates input fields
 * - Sends POST request to registration API
 * - Displays error alerts
 * - Redirects user on successful registration
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

  /**
   * Input Validation
   *
   * Validates all form fields before submitting.
   * Includes:
   * - Name length
   * - Email format
   * - Password strength (length, uppercase, number, special char)
   * - Password confirmation
   */
  const validate = () => {
    const { password, confirm, name, email } = form;

    // Min. and max. length of name
    if (name.length < 3) return 'reg_page.error_alert.name_length_min';
    if (name.length > 50) return 'reg_page.error_alert.name_length_max';

    // Emial valid. with regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'reg_page.error_alert.email_format';

    // Password validation (lenght, special character and confirmation)
    if (password.length < 6 || password.length > 20)
      return 'reg_page.error_alert.pass_length';
    if (!/[A-Z]/.test(password)) return 'reg_page.error_alert.pass_upper';
    if (!/[0-9]/.test(password)) return 'reg_page.error_alert.pass_number';
    if (!/[!@#$%^&*-]/.test(password))
      return 'reg_page.error_alert.pass_special';
    if (password !== confirm) return 'reg_page.error_alert.pass_confirm';
    return '';
  };

  /**
   * Handle Submit
   *
   * Handles user registration:
   * - Validates form
   * - Sends request to backend API
   * - Handles and translates API errors
   * - Redirects to login page on success
   */
  const handleRegister = async () => {
    if (!verifyClientOrigin()) {
      setError('invalid_origin');
      return;
    }
    setIsLoading(true);
    setError('');

    // Trigger validation
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Call BE api for registration
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      // Maping error code from API route to alert for i18n
      const errorMap: Record<string, string> = {
        email_registered: 'reg_page.error_alert.email_registered',
        missing_credentials: 'reg_page.error_alert.missing_credentials',
        req_failed: 'reg_page.error_alert.reg_failed',
        not_allowed_origin: 'invalid_origin',
      };

      const data = await res.json();
      if (!res.ok) {
        const translatedKey =
          errorMap[data.error] || 'reg_page.error_alert.unexpected';
        setError(translatedKey);
        return;
      }

      // Redirect to login page with success message (query parameter)
      router.push('/login?fromRegister=true');

      // Reset of form inputs
      setForm({ name: '', email: '', password: '', confirm: '' });
    } catch (err) {
      if (err instanceof TypeError) {
        setError('reg_page.error_alert.network_error');
      } else {
        setError('reg_page.error_alert.unexpected');
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={sxStyles.form}>
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

      {/* Registration/Submit button */}
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
