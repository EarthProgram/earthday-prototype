export default function SelectLanguage(onSelect) {
  const languages = [
    {
      name: "English",
      code: "en",
    },
    {
      name: "हिन्दी",
      code: "hi",
    },
  ];

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
          <label htmlFor="radio-item-1">{item.name}</label>
        </div>
      ))}
    </form>
  );
}
