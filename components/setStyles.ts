import constants from "../constants/constant.json";

export function setCss() {
    const setProperty = (key, value) => {
        if (!!value)
            document.documentElement.style.setProperty(key, value);
    };
    const countryCode = getCountry();
    const data = constants[countryCode];
    setProperty("--bg-color", data.mainColor);
    setProperty("--step-accomplished", data.mainColor)
    setProperty("--step-inprogress", data.secondaryColor)
    setProperty("--main-font", data.mainFont)
    setProperty("--main-font-size", data.mainFontSize)
    setProperty("--main-font-color", data.mainFontColor)
    setProperty("--progress-bar-color", data.progressBarColor)
    setProperty("--btn-primary-color", data.priBtnColor)
    setProperty("--btn-secondary-color", data.secBtnColor)
    setProperty("--btn-primary-font-color", data.priBtnFontColor)
    setProperty("--btn-secondary-font-color", data.secBtnFontColor)
    setProperty("--btn-primary-font", data.mainFont)
    setProperty("--step-color", data.stepColor)
}

export function getCountry(): string {
    const host = location.host.substring(0, location.host.indexOf('.'));
    return constants[host] != null ? host : "chimple";
}