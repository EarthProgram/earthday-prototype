import { useTranslation } from "next-i18next";

export default function CustomTextBox({ currentStep }) {
  const data = [
    ["explainsAboutApp", "takeChallenge"],
    ["doYouKnow", "firstEarthDay"],
    ["doYouKnow", "20MillionPeople"],
    ["doYouPledge"],
    ["awesome", "youHaveReceived"],
    ["explainShowQRCode", "or", "explainScanQRCode"],
    ["", ""],
    ["", ""],
    ["thankYou", ""],
  ];
  const { t } = useTranslation("common");

  return (
    <div>
      <div
        style={{
          width: "225px",
          textAlign: "center",
          display: "inline-block",
        }}
      >
        {data[currentStep].map((item, index) => (
          <p key={index} className="txt">
            {t(item) ?? ""}
          </p>
        ))}
      </div>
    </div>
  );
}
