import { useTranslation } from "next-i18next";
import Head from "next/head";
import config from "../constants/config.json";
import { getCountry } from "./setStyles";

export default function Header() {
  const { t } = useTranslation("common");
  const mainFontUrl = config[getCountry()].mainFontUrl;
  const favIcon = "/logos/" + config[getCountry()].favIcon;

  return (
    <Head>
      <title>{t("title")}</title>
      <link rel="icon" href={favIcon} />
      {mainFontUrl && <style>@import url({mainFontUrl}); </style>}
    </Head>
  );
}
