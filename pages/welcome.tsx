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
import { getCountry, setCss } from "../components/setStyles";
import config from "../constants/config.json";
import WalletInfo from "../components/walletInfo";
import { broadcastTransaction } from "../utils/utils";
// const { makeWallet, makeClient } = require("@ixo/client-sdk");

declare global {
  interface Window {
    interchain: any;
  }
}
// let wallet;
// let client;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [qrData, setQrData] = useState(null);
  const [isScan, setIsScan] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isWallterError, setIsWallterError] = useState(false);

  const router = useRouter();
  let customLocale;

  useEffect(() => {
    setMounted(true);
    setCss();
  }, []);
  const { t } = useTranslation("common");
  const btnText = [
    "select",
    "start",
    "continue",
    "continue",
    "pledge",
    "continue",
    "playGame",
    "show",
    "done",
    "sendToken",
    "goodbye",
  ];

  useEffect(() => {
    const tempPage = Number(
      new URL(location.href)?.searchParams?.get("page") ?? 0
    );
    let page = tempPage > 10 || isNaN(tempPage) ? 0 : tempPage;
    if (page === 0 && config[getCountry()].lang.length < 2) {
      page = 1;
    }
    setCurrentStep(page);
  });
  return (
    mounted && (
      <div className="container">
        <Header />

        {currentStep > 1 && currentStep < 7 && (
          <div>
            <div className="inLine">
              <MultiStepProgressBar currentStep={currentStep - 2} />
            </div>
          </div>
        )}

        <div className="main-header">
          <Logo />
          <div className="txt-header">
            <div>
              {currentStep === 8 ? (
                <CustomQRCode isScan={false} />
              ) : currentStep === 9 ? (
                <CustomQRCode
                  isScan={true}
                  ondata={(data) => {
                    setQrData(data);
                  }}
                />
              ) : currentStep === 5 ? (
                <WalletInfo
                  onLoad={(isError) => {
                    setIsWallterError(isError);
                    setIsLoading(false);
                  }}
                />
              ) : (
                <CustomTextBox
                  currentStep={currentStep}
                  onLoadStart={() => {
                    setIsLoading(true);
                  }}
                  onLoadEnd={() => {
                    setIsLoading(false);
                  }}
                />
              )}
              {currentStep === 0 &&
                SelectLanguage(
                  (onselect = (code) => {
                    customLocale = code;
                  })
                )}
            </div>
          </div>
          {currentStep !== 5 (
          <div className="btn-column">
            <button
              type="button"
              className="bttn "
              disabled={
                isLoading || (currentStep === 9 && isScan && qrData == null)
              }
              onClick={onCLick}
            >
              {t(btnText[currentStep])}
            </button>
            <br />
            {currentStep > 6 && currentStep < 10 && (
              <button
                type="button"
                disabled={isLoading}
                className={"bttn " + (currentStep > 7 ? "sec" : null)}
                onClick={(event) => {
                  onCLick(event, true);
                }}
              >
                {currentStep === 7 ? t("scan") : t("exit")}
              </button>
            )}
          </div>
            )}
            </div>
      </div>
    )
  );
  function onCLick(event, isExit = false) {
    event.preventDefault();
    if (isExit) {
      if (currentStep === 7) {
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
      case 6:
        onContinue();
        break;
      case 4:
        onPledge();
        break;
      case 5:
        // onPledgeContinue();
        break;
      case 7:
        // onShowQR();
        break;
      case 8:
      case 9:
        // onPlayGame();
        break;
      default:
        router.push("/");
        break;
    }
  }

  async function onContinue(
    step = currentStep + 1,
    props = {},
    locale = router.locale
  ) {
    // setCurrentStep(currentStep + 1);
    // broadcastTransaction();
    await router.push(
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

  async function onPledgeContinue() {
    if (isWallterError) {
      await onContinue(0);
      setIsWallterError(false);
      setIsLoading(false);
      return;
    }
    await onContinue();
  }
  async function onPledge() {
    setIsLoading(true);
    await onContinue();
  }

  async function onLanguageSelect() {
    onContinue(currentStep + 1, null, customLocale);
  }

  async function onPlayGame() {
    setIsLoading(true);
    if (isScan) {
      if (qrData) {
        await broadcastTransaction(qrData);
      }
    }
    setIsLoading(false);
    await onContinue(7);
  }

  async function onShowQR() {
    setIsScan(false);
    await onContinue(currentStep + 1);
  }

  async function onScanQR() {
    setIsScan(true);
    await onContinue(currentStep + 2);
  }

  async function onExit() {
    onContinue(10);
  }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
