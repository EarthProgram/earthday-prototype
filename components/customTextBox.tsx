import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { getBalance } from "../utils/utils";

export default function CustomTextBox({ currentStep, onLoadStart, onLoadEnd }) {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const data = [
    ["chooseLanguage"],
    ["explainsAboutApp", "takeChallenge"],
    ["doYouKnow", "firstEarthDay"],
    ["doYouKnow", "20MillionPeople"],
    ["doYouPledge"],
    [],
    ["awesome", "youHaveReceived"],
    ["explainShowQRCode", "or", "explainScanQRCode"],
    [],
    [],
    ["thankYou"],
  ];
  const { t } = useTranslation("common");
  useEffect(() => {
    if (currentStep === 6) {
      getBalanceData();
    }
  }, []);
  return (
    !isLoading && (
      <div>
        <div className="txt-box ">
          {data[currentStep].map((item, index) => (
            <p key={index} className="txt">
              {t(item) ?? ""}
            </p>
          ))}

          {currentStep === 6 && (
            <p className="txt">
              {(t("earthDayBalance") ?? "") + balance.toString() + " tokens"}
            </p>
          )}
        </div>
      </div>
    )
  );
  async function getBalanceData() {
    setIsLoading(true);
    onLoadStart();
    const bal = (await getBalance()) ?? 0;
    setBalance(bal);
    onLoadEnd();
    setIsLoading(false);
  }
}
