import {
  CustomPaletteOptions,
  PaletteOptions,
  Theme as T,
  ThemeOptions,
  Palette,
  TypeBackground,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CustomPaletteOptions extends Palette {
    navBarBackground: string;
    borderColor: string;
  }

  interface CustomTheme extends T {
    palette: CustomPaletteOptions;
  }

  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    palette: CustomPaletteOptions;
    background: TypeBackground;
  }
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

declare module "@emotion/react/types" {
  interface Theme extends T {
    palette: CustomPaletteOptions;
  }
}
