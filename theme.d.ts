import { Theme as T, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CustomTheme extends T {}
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {}
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

declare module "@emotion/react/types" {
  interface Theme extends T {}
}
