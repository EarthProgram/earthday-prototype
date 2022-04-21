import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { getAddress, getBalance } from "../utils/utils";

export default function CustomTextBox({ currentStep, onLoadStart, onLoadEnd }) {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pubAddress, setPubAddress] = useState(null);

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
    if (currentStep > 5) {
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

          {currentStep > 5 && (
            <>
              {currentStep !== 10 && (
                <p className="txt"> {t("yourAddress") + pubAddress}</p>
              )}
              <p className="txt">
                {(t("earthDayBalance") ?? "") + balance.toString() + " tokens"}
              </p>
            </>
          )}
        </div>
      </div>
    )
  );
  async function getBalanceData() {
    setIsLoading(true);
    onLoadStart();
    const tempAddress = (await getAddress()) ?? "";
    const bal = (await getBalance()) ?? 0;
    setPubAddress(tempAddress);
    setBalance(bal);
    onLoadEnd();
    setIsLoading(false);
  }
}
