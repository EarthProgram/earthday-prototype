export default function CustomTextBox({ currentStep }) {
  const data = [
    [
      "Explains what this app is about in the user's own language.",
      "Take the Earth Day Challenge!",
    ],
    ["Did you know?", "The first Earth Day was held on April 22, 1970."],
    ["Did you know?", "20 million people recognized the first Earth Day."],
    ["Do you pledge to...", "...support the goals of Earth Day?"],
    ["Awesome!", "Here's an NFT badge to show that you are an Earth Hero!"],
    ["", ""],
    ["Thank you for taking part in our Earth Day fun!", ""],
  ];

  return (
    <div>
      <div
        style={{
          width: "225px",
          textAlign: "center",
          display: "inline-block",
        }}
      >
        <p className="txt">{data[currentStep][0] ?? ""}</p>
        <div>
          <p className="txt">{data[currentStep][1] ?? ""}</p>
        </div>
      </div>
    </div>
  );
}
