import { useEffect, useState } from "react";
import MultiStepProgressBar from "../components/multiStepBar";
import CustomTextBox from "../components/customTextBox";
import { useRouter } from "next/router";
import Logo from "../components/logo";

export default function Home({ users }) {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const btnText = [
    "Start",
    "Continue",
    "Continue",
    "Pledge",
    "View Badge",
    "Nice!",
    "Goodbye!",
  ];
  useEffect(() => {
    setMounted(true);
  }, []);
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
                {btnText[currentStep]}
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
                  Exit
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
      router.push("/");
      return;
    }
    setCurrentStep(currentStep + 1);
  }
}
