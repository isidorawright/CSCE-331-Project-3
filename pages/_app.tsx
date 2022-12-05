import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../util/createEmotionCache";
import NavBar, { TemporaryDrawer } from "../components/NavBar";
import "../styles/globals.css";
import { initializeStore, store } from "../models/store";
import { Provider } from "react-redux";
import { once } from "lodash";
import { Notifications } from "../components/Notifications";
import { GlobalModal } from "../components/GobalModal";

// Client-side cache shared for the whole user session in the browser.

const clientSideEmotionCache = createEmotionCache();

let googleTranslateElementInit = once(() => {
  try {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: "en",
        layout: (window as any).google.translate.TranslateElement.InlineLayout
          .SIMPLE,
      },
      "google_translate_element"
    );
  } catch (e) {
    console.error(e);
  }
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
          <div id="google_translate_element" style={{ padding: "15px" }}></div>
          <Notifications />
          <GlobalModal />
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}
