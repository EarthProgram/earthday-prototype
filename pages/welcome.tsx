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
import { getDidDoc, signEd25519, signSecp256k1 } from "../utils/utils";
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
    let page = tempPage > 9 || isNaN(tempPage) ? 0 : tempPage;
    if (page === 0 && config[getCountry()].lang.length < 2) {
      page = 1;
    }
    setCurrentStep(page);
  });
  return (
    mounted && (
      <div className="container">
        <Header />

        {currentStep > 1 && currentStep < 6 && (
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
              {currentStep === 7 ? (
                <CustomQRCode isScan={false} />
              ) : currentStep === 8 ? (
                <CustomQRCode
                  isScan={true}
                  ondata={(data) => {
                    setQrData(data);
                  }}
                />
              ) : (
                <CustomTextBox currentStep={currentStep} />
              )}
              {currentStep === 0 &&
                SelectLanguage(
                  (onselect = (code) => {
                    customLocale = code;
                  })
                )}
            </div>
          </div>
          <div className="btn-column">
            <button
              type="button"
              className="bttn "
              disabled={
                isLoading || (currentStep === 8 && isScan && qrData == null)
              }
              onClick={onCLick}
            >
              {t(btnText[currentStep])}
            </button>
            <br />
            {currentStep > 5 && currentStep < 9 && (
              <button
                type="button"
                disabled={isLoading}
                className={"bttn " + (currentStep > 6 ? "sec" : null)}
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

  async function onPledge() {
    setIsLoading(true);
    getDidDoc();
    // await broadcastTransaction();
    await signEd25519();
    await signSecp256k1();
    await onContinue();
    setIsLoading(false);
  }

  async function onLanguageSelect() {
    onContinue(currentStep + 1, null, customLocale);
  }

  async function onPlayGame() {
    setIsLoading(true);
    if (isScan) {
      // if (!client) {
      //   await broadcastTransaction();
      // }
      if (qrData) {
        // const res = await client.sendTokens(qrData, 10);
        // console.log("result", res);
      }
    }
    await onContinue(6, null, customLocale);
    setIsLoading(false);
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