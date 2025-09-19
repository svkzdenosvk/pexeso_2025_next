'use client';

import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from "next/navigation";

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@pexeso/lib/redux/store/store';
import { clearUser } from '@pexeso/lib/redux/store/reducers/authSlice';
import { logoutAction } from '@pexeso/app/actions/logoutAction';

/**
 * A responsive button group component for handling user login,
 * registration, and logout actions based on authentication status.
 *
 * Features:
 * - Shows login and registration buttons if user is not logged in
 * - Shows logout button (and user's name) if logged in
 * - Uses i18n translation support via `react-i18next`
 * - Clears Redux store and server-side cookies on logout
 *
 * @component
 * @example
 * <ButtonLogReg />
 *
 * @remarks
 * Relies on Redux for `auth.user` state, and uses a server action (`logoutAction`) 
 * to clear the authentication cookie.
 *
 * @dependencies
 * @mui/material, next/navigation, react-i18next, react-redux
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
  const router = useRouter(); 

  // Access user data from Redux
  const { user } = useSelector((state: RootState) => state.auth);

  // Handle logout by clearing both cookies (server) and Redux (client)
   const handleLogout = async () => {
    const res = await logoutAction();

    if (res.success) {
      dispatch(clearUser()); // Clear Redux state
      router.refresh();  // Re-render app with logged-out state
    } else {
      console.error('Logout failed');
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
