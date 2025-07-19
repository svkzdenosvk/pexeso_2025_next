"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";

const styles = {
  wrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 2,
    p: 2,
  },
  linkButton: {
    textTransform: "none",
    fontSize: "1rem",
    px: 2,
    py: 1,
  },
};

const ButtonLogReg = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { user } = useSelector((state: RootState) => state.auth);

// logout handler function
  const handleLogout = async () => {
  try {
    await fetch("/api/logout"); // delete cookies on server
    dispatch(clearUser()); // clear redux
  } catch (err) {
    console.error("Logout failed:", err);
  }
};


  return (
    <Box sx={styles.wrapper}>
      <Typography variant="body1">
        {user?.name && user.name}
      </Typography>

      {!user?.uid ? (
        <>
          <Button
            component={Link}
            href={`/registration`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t("reg_log_btn.reg")}
          </Button>
          <Button
            component={Link}
            href={`/login`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t("reg_log_btn.log")}
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          sx={styles.linkButton}
          onClick={handleLogout}
        >
          {t("reg_log_btn.log_out")}
        </Button>
      )}
    </Box>
  );
};

export default ButtonLogReg;
