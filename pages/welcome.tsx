import { useEffect, useState } from "react";
import MultiStepProgressBar from "../components/multiStepBar";
import CustomTextBox from "../components/customTextBox";
import { useRouter } from "next/router";
import Logo from "../components/logo";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CustomQRCode from "../components/customQRCode";
import SelectLanguage from "../components/selectLanguage";
import Header from "../components/header";
declare global {
  interface Window {
    interchain: any;
  }
}
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  let customLocale;

  const { t } = useTranslation("common");
  const btnText = [
    "select",
    "start",
    "continue",
    "continue",
    "pledge",
    "playGame",
    "show",
    "done",
    "sendToken",
    "goodbye",
  ];
  useEffect(() => {
    setMounted(true);
    // const color = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    // document.documentElement.style.setProperty('--bg-color', "white");
    const page = Number(new URL(location.href)?.searchParams?.get("page") ?? 0);
    setCurrentStep(page > 9 || isNaN(page) ? 0 : page);
  });
  return (
    mounted && (
      <div className="container">
        <Header />
        <div className="inLine">
          {currentStep > 1 && currentStep < 6 && (
            <MultiStepProgressBar currentStep={currentStep - 2} />
          )}
          <Logo />
        </div>
        <div>
          <div className="txt-header">
            <div>
              {currentStep === 7 ? (
                <CustomQRCode isScan={false} />
              ) : currentStep === 8 ? (
                <CustomQRCode isScan={true} />
              ) : (
                <CustomTextBox currentStep={currentStep} />
              )}
            </div>

            {currentStep === 0 &&
              SelectLanguage(
                (onselect = (code) => {
                  customLocale = code;
                })
              )}

            <div className="btn-column">
              <button type="button" className="bttn " onClick={onCLick}>
                {t(btnText[currentStep])}
              </button>
              <br />
              {currentStep > 5 && currentStep < 9 && (
                <button
                  type="button"
                  className="bttn "
                  onClick={(event) => {
                    onCLick(event, true);
                  }}
                >
                  {currentStep === 6 ? t("scan") : t("exit")}
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
      if (currentStep === 6) {
        onScanQR();
        return;
      }
      onExit();
      return;
    }
    switch (currentStep) {
      case 0:
        onLanguageSelect();
        break;
      case 1:
      case 2:
      case 3:
      case 5:
        onContinue();
        break;
      case 4:
        onPledge();
        break;
      case 6:
        onShowQR();
        break;
      case 7:
      case 8:
        onPlayGame();
        break;
      default:
        router.push("/");
        break;
    }
  }

  function onContinue(
    step = currentStep + 1,
    props = {},
    locale = router.locale
  ) {
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
      },
      {
        locale: locale,
      }
    );
  }

  async function onPledge() {
    onContinue();
  }

  async function onLanguageSelect() {
    onContinue(currentStep + 1, null, customLocale);
  }

  async function onPlayGame() {
    onContinue(6, null, customLocale);
  }

  async function onShowQR() {
    onContinue(currentStep + 1);
  }

  async function onScanQR() {
    onContinue(currentStep + 2);
  }

  async function onExit() {
    onContinue(9);
  }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
