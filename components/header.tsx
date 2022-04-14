import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Header() {
  const { t } = useTranslation("common");
  return (
    <Head>
      <title>{t("title")}</title>
      <link rel="icon" href="favicon.ico" />
    </Head>
  );
}
