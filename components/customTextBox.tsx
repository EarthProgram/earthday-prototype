import { useTranslation } from "next-i18next";

export default function CustomTextBox({ currentStep }) {
  const data = [
    ["explainsAboutApp", "takeChallenge"],
    ["doYouKnow", "firstEarthDay"],
    ["doYouKnow", "20MillionPeople"],
    ["doYouPledge", "supportGoals"],
    ["awesome", "here'sNFT"],
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
        <p className="txt">{t(data[currentStep][0]) ?? ""}</p>
        <div>
          <p className="txt">{t(data[currentStep][1]) ?? ""}</p>
        </div>
      </div>
    </div>
  );
}
