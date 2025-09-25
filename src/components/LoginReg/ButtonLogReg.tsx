'use client';

import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@pexeso/lib/redux/store/store';
import { clearUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import { useLogoutMutation } from '@pexeso/lib/redux/services/authApi';

/**
 *  A responsive button group component that handles user authentication actions
 * (login, registration, and logout) based on the current authentication state.
 *
 * Features:
 * - Displays login and registration buttons when the user is not authenticated
 * - Displays the logged-in user's name and a logout button when authenticated
 * - Integrates with i18n for translations
 * - Logs the user out by calling the RTK Query `logout` mutation (clears cookies on the server)
 * - Clears user data from the Redux store on successful logout
 *
 * @component
 * @example
 * <ButtonLogReg />
 *
 * @remarks
 * Depends on Redux for `auth.user` state and RTK Query for logout API calls.
 *
 * @dependencies
 * @mui/material, next/link, react-i18next, react-redux, RTK Query
 */

// ---------- Sx styles

const styles = {
  wrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
    p: 2,
  },
  linkButton: {
    textTransform: 'none',
    fontSize: '1rem',
    px: 2,
    py: 1,
  },
};

// ---------- Component

const ButtonLogReg = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // RTK Query logout mutation hook
  const [logout] = useLogoutMutation();

  // Access user data from Redux
  const { user } = useSelector((state: RootState) => state.auth);

  /**
   * Handles user logout:
   * - Calls the `logout` RTK mutation to clear the authentication cookie on the server
   * - Dispatches `clearUser()` to remove user data from Redux state
   */
  const handleLogout = async () => {
    try {
      await logout().unwrap(); // Clear cookies on server via API
      dispatch(clearUser()); // Clear Redux auth state on client
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Box sx={styles.wrapper}>
      {/* Show user's name if logged in */}
      <Typography variant="body1">{user?.name && user.name}</Typography>

      {/* If user is not logged in, show login and registration buttons */}
      {!user?.uid ? (
        <>
          <Button
            component={Link}
            href={`/registration`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t('reg_log_btn.reg')}
          </Button>
          <Button
            component={Link}
            href={`/login`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t('reg_log_btn.log')}
          </Button>
        </>
      ) : (
        // If user is logged in, show logout button
        <Button
          variant="contained"
          sx={styles.linkButton}
          onClick={handleLogout}
        >
          {t('reg_log_btn.log_out')}
        </Button>
      )}
    </Box>
  );
};

export default ButtonLogReg;
