import { useEffect, useState } from "react";
import MultiStepProgressBar from "../components/multiStepBar";
import CustomTextBox from "../components/customTextBox";
import { useRouter, withRouter } from "next/router";
import Logo from "../components/logo";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CustomQRCode from "../components/customQRCode";
declare global {
  interface Window {
    interchain: any;
  }
}
export default function Home() {
  const [mounted, setMounted] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const { t } = useTranslation("common");
  const btnText = [
    "start",
    "continue",
    "continue",
    "pledge",
    "playGame",
    "show",
    "playGame",
    "playGame",
    "goodbye",
  ];
  useEffect(() => {
    setMounted(true);
    const page = new URL(location.href)?.searchParams?.get("page") ?? 0;
    setCurrentStep(Number(page));
  });
  return (
    mounted && (
      <div className="container">
        <div style={{ height: "30vh", display: "inline-table" }}>
          {currentStep > 0 && currentStep < 5 && (
            <MultiStepProgressBar currentStep={currentStep - 1} />
          )}
          <br />
          <Logo />
        </div>
        <div>
          <div
            style={{
              justifyContent: "space-between",
              flexDirection: "column",
              height: "50vh",
              display: "flex",
              marginBottom: "5vh",
            }}
          >
            <div>
              {currentStep === 6 ? (
                <CustomQRCode isScan={false} />
              ) : currentStep === 7 ? (
                <CustomQRCode isScan={true} />
              ) : (
                <CustomTextBox currentStep={currentStep} />
              )}
            </div>
            <div
              style={{
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <button type="button" className="bttn " onClick={onCLick}>
                {t(btnText[currentStep])}
              </button>
              <br />
              {currentStep > 4 && currentStep < 8 && (
                <button
                  type="button"
                  className="bttn "
                  onClick={(event) => {
                    onCLick(event, true);
                  }}
                >
                  {currentStep === 5 ? t("scan") : t("done")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
  function onCLick(event, isExit = false) {
    event.preventDefault();
    if (isExit) {
      if (currentStep === 5) {
        onScanQR();
        return;
      }
      onExit();
      return;
    }
    switch (currentStep) {
      case 0:
      case 1:
      case 2:
      case 4:
        onContinue();
        break;
      case 3:
        onPledge();
        break;
      case 5:
        onShowQR();
        break;
      case 6:
      case 7:
        onPlayGame();
        break;
      default:
        router.push("/");
        break;
    }
  }

  function onContinue(step = currentStep + 1, props = {}) {
    // setCurrentStep(currentStep + 1);
    router.push(
      {
        pathname: "/welcome",
        query: {
          page: step,
          ...props,
        },
      },
      {
        pathname: "/welcome",
        query: {
          page: step,
        },
      }
    );
  }

  async function onPledge() {
    onContinue();
  }

  async function onPlayGame() {
    onExit();
  }

  async function onShowQR() {
    onContinue(currentStep + 1);
  }

  async function onScanQR() {
    onContinue(currentStep + 2);
  }

  async function onExit() {
    onContinue(8);
  }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
