import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Logo from "../components/logo";

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
        <Head>
          <title>ReactJS with react-bootstrap</title>
          <link rel="icon" href="favicon.ico" />
        </Head>
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
