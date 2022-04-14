import { useEffect } from "react";
import { useRouter } from "next/router";
import Logo from "../components/logo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../components/header";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/welcome");
    }, 1500);
  }, []);
  return (
    <div>
      <div>
        <Header />
        <div className="splash-screen">
          <Logo />
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
