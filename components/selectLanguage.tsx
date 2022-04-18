import config from "../constants/config.json";
import { getCountry } from "./setStyles";

export default function SelectLanguage(onSelect) {
  const languages = config[getCountry()].lang;

  onSelect(languages[0].code);

  return (
    <form className="radio-btn">
      {languages.map((item, index) => (
        <div key={index} className="block">
          <label className="txt radio-label">
            <input
            className="radio-input"
              value={item.code}
              onChange={(e) => onSelect(e.target.value)}
              defaultChecked={index === 0}
              type="radio"
              name="radio"
            />
            {item.name}
          </label>
        </div>
      ))}
    </form>
  );
}
