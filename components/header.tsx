import { useTranslation } from "next-i18next";
import Head from "next/head";
import constants from "../constants/constant.json";
import { getCountry } from "./setStyles";

export default function Header() {
  const { t } = useTranslation("common");
  const mainFontUrl = constants[getCountry()].mainFontUrl;
  const favIcon = "/logos/" + constants[getCountry()].favIcon;

  return (
    <Head>
      <title>{t("title")}</title>
      <link rel="icon" href={favIcon} />
      {mainFontUrl && <style>@import url({mainFontUrl}); </style>}
    </Head>
  );
}
