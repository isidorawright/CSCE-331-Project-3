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
import { Provider } from "react-redux";
import { once } from "lodash";

// Client-side cache shared for the whole session
// of the user in the browser.

const clientSideEmotionCache = createEmotionCache();

let googleTranslateElementInit = once(() => {
  new (window as any).google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
});

export default function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  React.useEffect(() => {
    initializeStore(store);
    googleTranslateElementInit();
  });
  return (
    <Provider store={store}>
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
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.7667023268996!2d-96.34363518513555!3d30.612342998476418!
          2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864683afcd3de05f%3A0xf78e5c7be3131946!2sSpin%20&#39;N%20Stone%20Pizza%20-%20MSC!
          5e0!3m2!1sen!2sus!4v1668567572807!5m2!1sen!2sus"
            width="600"
            height="450"
            loading="lazy"
          ></iframe>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}
