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
import ActionButton, { ActionButtonType } from "../components/ActionButton";
import { Router, useRouter } from "next/router";

// Client-side cache shared for the whole user session in the browser.

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  React.useEffect(() => {
    initializeStore(store);
    if(router.asPath === "/manager") {
      store.dispatch.actionButton.setOpen(true);
      store.dispatch.actionButton.setType(ActionButtonType.updateManager);
    } else {
      store.dispatch.actionButton.setOpen(false);

    }
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
          <ActionButton />
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}
