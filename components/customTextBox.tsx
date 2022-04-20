import { useTranslation } from "next-i18next";

export default function CustomTextBox({ currentStep }) {
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

  return (
    <div>
      <div className="txt-box ">
        {data[currentStep].map((item, index) => (
          <p key={index} className="txt">
            {t(item) ?? ""}
          </p>
        ))}
      </div>
    </div>
  );
}
