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
    }, 3000);
  }, []);
  return (
    <div>
      <div>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "800px",
          }}
        >
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
