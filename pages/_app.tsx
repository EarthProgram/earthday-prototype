import type { AppProps } from "next/app";
import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";

function Application({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(Application);
