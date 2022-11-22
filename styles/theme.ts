import { createTheme, CustomThemeOptions } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "@mui/material";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#E8B349",
    },
    secondary: {
      main: "#279af1",
    },
    mode: "light",
    borderColor: "#131313",

  },
} as CustomThemeOptions);

export const highConstrasttheme = createTheme({
  palette: {
    primary: {
      main: "#E8B349",
    },
    secondary: {
      main: "#279af1",
    },
    mode: "dark",
    borderColor: "#131313",
    background: {
      default: "#F00ffa",
      paper: "#000",
    },
  },
} as CustomThemeOptions);

export default theme;
