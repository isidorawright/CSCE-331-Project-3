import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../util/createEmotionCache";
import { AppProps } from "next/app";
import NavBar, { TemporaryDrawer } from "../components/NavBar";
import "../styles/globals.css";
import { initializeStore, store } from "../models/store";
import { once } from "lodash";

// Client-side cache shared for the whole session
// of the user in the browser.

const clientSideEmotionCache = createEmotionCache();

let googleTranslateElementInit = once(() => {
  new (window as any).google.translate.TranslateElement(
      {pageLanguage: 'en'},
      'google_translate_element'
  );
});


export default function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  React.useEffect(() => {
    initializeStore(store);
    googleTranslateElementInit();
  });
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TemporaryDrawer />
        <NavBar />
        <Component {...pageProps} />
        <div id="google_translate_element"></div>
      </ThemeProvider>
    </CacheProvider>
  );
}
