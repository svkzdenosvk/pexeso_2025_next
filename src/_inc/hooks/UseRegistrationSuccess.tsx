import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * useRegisterRedirectSuccess Hook
 *
 * Detects if user was redirected from registration (via `?fromRegister` query param).
 * Provides a flag `showSuccess` to display a one-time success message.
 *
 * @hook
 * @returns {boolean} showSuccess – true if redirect flag was detected
 *
 * @example
 * const showSuccess = useRegisterRedirectSuccess();
 *
 * @remarks
 * - Cleans up the URL by removing `?fromRegister` without page reload
 *   to prevent showing the message again on refresh.
 */
export const useRegistrationSuccess = (): boolean => {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("fromRegister")) {
      setShowSuccess(true);

      // Remove query param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("fromRegister");
      router.replace(url.toString());
    }
  }, [searchParams, router]);

  return showSuccess;
};
