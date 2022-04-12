import { useEffect, useState } from "react";
import MultiStepProgressBar from "../components/multiStepBar";
import CustomTextBox from "../components/customTextBox";
import { useRouter } from "next/router";
import Logo from "../components/logo";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
declare global {
  interface Window {
    interchain: any;
  }
}
export default function Home() {
  //
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const router = useRouter();
  const { t } = useTranslation("common");
  const btnText = [
    "start",
    "continue",
    "continue",
    "pledge",
    "viewBadge",
    "nice",
    "goodbye",
  ];
  useEffect(() => {
    setMounted(true);
  });
  return (
    mounted && (
      <div className="container">
        <div style={{ height: "35vh", display: "inline-table" }}>
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
            }}
          >
            <div>
              {currentStep === 5 ? (
                <Logo />
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
              {currentStep > 2 && currentStep < 5 && (
                <button
                  type="button"
                  className="bttn "
                  onClick={(event) => {
                    onCLick(event, true);
                  }}
                >
                  {t("exit")}
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
      setCurrentStep(6);
      return;
    }
    if (currentStep >= 6) {
      router.push("/scan");
      return;
    }
    setCurrentStep(currentStep + 1);
  }
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
