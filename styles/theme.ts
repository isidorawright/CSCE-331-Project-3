import { createTheme, CustomThemeOptions } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#E8B349",
    },
    secondary: {
      main: "#279af1",
    },
    error: {
      main: red.A400,
    },
    mode: "dark",
    borderColor: "#131313",
  },
  background: {
    default: "#020202",
    paper: "#24292F",
  },
} as CustomThemeOptions);

export default theme;
