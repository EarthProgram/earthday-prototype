import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Logo from "../components/logo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../components/header";
import { getCountry, setCss } from "../components/setStyles";
import config from "../constants/config.json";
import { broadcastTransaction } from "../utils/utils"

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    setMounted(true);
    const tempCode = getCountry();
    setCountryCode(tempCode);
    setCss();
    setTimeout(() => {
      router.push("/welcome", "/welcome", {
        locale: config[tempCode].lang[0].code,
      });
    }, 1500);
    // init();
  }, []);
  console.log("countryCode", countryCode);
  return (
    mounted && (
      <div>
        <div>
          <Header />
          <div className="splash-screen">
            <Logo />
          </div>
        </div>
      </div>
    )
  );
}

async function init() {
  broadcastTransaction("ixo1wfvqcamfzqq6y0j75r3n9ascj3tuvup3jqtnwc");
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
