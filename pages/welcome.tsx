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
const { makeWallet, makeClient } = require("@ixo/client-sdk");

declare global {
  interface Window {
    interchain: any;
  }
}
let wallet;
let client;
export let didId;
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
    await onContinue();
    setIsLoading(false);
  }

  async function onLanguageSelect() {
    onContinue(currentStep + 1, null, customLocale);
  }

  async function onPlayGame() {
    setIsLoading(true);
    if (isScan) {
      if (!client) {
        await broadcastTransaction();
      }
      if (qrData) {
        const res = await client.sendTokens(qrData, 10);
        console.log("result", res);
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
  function getDidDoc() {
    // did: FMZFSG1T36MGfC3wJYnD6W

    if (!window["ixoKs"]) {
      // setdidDoc(interchain.getDidDoc("m / 44' / 118' / 0' / 0'"));
      console.log("geting diddoc intercain", window.interchain);
      const tempDid = window.interchain?.getDidDoc("m / 44' / 118' / 0' / 0'");
      if (tempDid) {
        const didJson = JSON.parse(tempDid);
        didId = didJson?.id?.replace("did:key", "did:sov");
      }
      if (!didId) {
        didId = "did:sov:FMZFSG1T36MGfC3wJYnD6W";
      }
      console.log("didId", didId);
    }
    // if (window["ixoKs"]) {
    //   ixoKsProvider.getDidDoc((error: any, response: any) => {
    //     if (error) {
    //       // handle error
    //     } else {
    //       setdidDoc(JSON.stringify(response));
    //     }
    //   });
    // }
  }
  async function broadcastTransaction() {
    // did: FMZFSG1T36MGfC3wJYnD6W
    try {
      //@ts-ignore
      if (!wallet) {
        wallet = await makeWallet();
        // "planet stomach collect august notice lend horse bread pudding hour travel main"
      }
      if (!client) {
        client = makeClient(
          wallet,
          "https://testnet.ixo.world/rest",
          "https://blocksync-pandora.ixo.world"
        );
        await client.register();
      }

      // wallet= wallet
    } catch (error) {
      console.info(error);
    }
    console.log("wallet", wallet);
    console.log("client", client);
  }
  async function signEd25519() {
    // original_json_message = '{"key1": "value1", "key2": "this entire textToSign can be any string really"}'
    // signature: 4b261d158804c08c10571bf30dbe7d3e7ff2f238af0ecd08f1666eb725d9ce00cc970f6798a9ce7ba6a5f90dfeb61537efe7e2a8cd1d84e35b79f6136cc0a30c
    const message =
      "7b226b657931223a202276616c756531222c20226b657932223a20227468697320656e746972652074657874546f5369676e2063616e20626520616e7920737472696e67207265616c6c79227d";

    const res = await window?.interchain?.signMessage(message, "ed25519", 0);
    console.log("result", res);
  }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
