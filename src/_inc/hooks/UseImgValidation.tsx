import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { my_Type_Guard_function } from "@pexeso/_inc/functions/general";
import type { RootState } from "@pexeso/lib/redux/store/store";

/**
 * useImgValidation Hook
 *
 * Validates the image name from the route parameters against the Redux store.
 * Provides an error flag, a translated display name (H3), and the raw image name.
 *
 * @hook
 * @returns {object} Validation state:
 * - `errorImgName` (boolean): true if invalid or missing name
 * - `imgNameH3` (string): translated heading for the image (or error text)
 * - `imageName` (string | undefined): raw image name from params
 *
 * @dependencies React, Next.js, Redux, i18next
 */

type My_Type_UseImgValidationReturn = {
  errorImgName: boolean;
  imgNameH3: string;
  imageName: string | undefined;
};

export const useImgValidation = (): My_Type_UseImgValidationReturn => {
  const { t } = useTranslation();
  const params = useParams();
  const { imgNames } = useSelector((state: RootState) => state.game);

  // Extract `name` param safely (only keep strings)
 const name = params?.name ? 
    (Array.isArray(params.name) ? params.name[0] : params.name) : 
    undefined;

  // Local state: error flag and translated heading
  const [errorImgName, setErrorImgName] = useState(false);
  const [imgNameH3, setNameH3] = useState("");

  useEffect(() => {
    // CASE 1: Missing or invalid param
    if (!name || typeof name !== "string") {
      setErrorImgName(true);
      setNameH3(t("single_img_page.h2.not_exist"));
      return;
    }

    // CASE 2: Name not in Redux imgNames list
    if (!my_Type_Guard_function(name, imgNames)) {
      setErrorImgName(true);
      setNameH3(t("single_img_page.h2.not_exist"));

    // CASE 3: Valid image name
    } else {
      setErrorImgName(false);
      setNameH3(t(`single_img_page.h2.${name}`));
    }
  }, [name, imgNames, t]);

  return { errorImgName, imgNameH3, imageName: name };
};