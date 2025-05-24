import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@pexeso/store/store";
import { Typography, Box } from "@mui/material";
import { MyMUIButton } from "@pexeso/components/SharedMUIElements/MyMUIButton";
import { MyMUIImg } from "@pexeso/components/SharedMUIElements/MyMUIImg";

// ---------- sx styles

const imgContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
} as const;

const imgMainContentStyles = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
  gap: "1%",
};

const btnLinkStyles = {
  backgroundColor: "white",
  textDecoration: "none",
  outline: "none",
  boxShadow: "none",
  border: "none",
  "&:hover": {
    boxShadow: "none",
  },
} as const;

const imgStyles = {
  transition: "box-shadow 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0px 0px 28px 19px goldenrod",
  },
} as const;

// ---------- component

const Images = () => {
  const { isLoading, imgNames } = useSelector((state: RootState) => state.game); //-------------with destructuring

  return (
    <Box sx={imgContentStyles}>
      <Typography variant="h2" component="h2">
        {" "}
        {/*originally h1 */}
        Hracie obrázky
      </Typography>
      <Box sx={imgMainContentStyles}>
        {isLoading || imgNames.length === 0 ? ( //----------------------------------------------if loading show H1
          <Typography variant="h4" component="h4">
            {" "}
            {/*originally h1 */}
            Načítavajú sa obrázky
          </Typography>
        ) : (
          //--------------------------------------------------------------------------------after loading show images
          imgNames.map((oneImgName) => (
            <Box key={oneImgName}>
              <MyMUIButton
                to={`/about-game/images/${oneImgName}`}
                sx={btnLinkStyles}
              >
                <MyMUIImg
                  sx={imgStyles}
                  src={`/pictures/pexeso/${oneImgName}.jpg`}
                />
              </MyMUIButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Images;
