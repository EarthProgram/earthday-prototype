import { useTranslation } from "next-i18next";
import Head from "next/head";
import constants from "../constants/constant.json";
import { getCountry } from "./setStyles";

export default function Header() {
  const { t } = useTranslation("common");
  const mainFontUrl = constants[getCountry()].mainFontUrl;
  return (
    <Head>
      <title>{t("title")}</title>
      <link rel="icon" href="favicon.ico" />
      {mainFontUrl && <style>@import url({mainFontUrl}); </style>}
    </Head>
  );
}
