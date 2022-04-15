import React from "react";

export default function MultiStepProgressBar({ currentStep }) {
  const totalSteps = 3;
  const stepPercentage = (currentStep / totalSteps) * 100;

  const getClassName = (index: number) =>
    `indexedStep ${
      currentStep === index
        ? "inProgress"
        : currentStep > index
        ? "accomplished"
        : null
    }`;

  return (
    <div className="progress">
      <div
        className="progress-bar"
        style={{ width: (stepPercentage > 98 ? 98 : stepPercentage) + "%" }}
      ></div>
      <ul className="progress-num">
        <li className={getClassName(0)}>1</li>
        <li className={getClassName(1)}>2</li>
        <li className={getClassName(2)}>3</li>
        <li className={getClassName(3)}>4</li>
      </ul>
    </div>
  );
}
