import constants from "../constants/constant.json";
import { getCountry } from "./setStyles";

export default function SelectLanguage(onSelect) {
  const languages = constants[getCountry()].lang;

  onSelect(languages[0].code);

  return (
    <form className="radio-btn">
      {languages.map((item, index) => (
        <div key={index} className="block">
          <input
            name="radio-item-1"
            value={item.code}
            type="radio"
            onChange={(e) => onSelect(e.target.value)}
            defaultChecked={index === 0}
          />
          <label className="txt" htmlFor="radio-item-1">{item.name}</label>
        </div>
      ))}
    </form>
  );
}
