import Image from "next/image";
import config from "../constants/config.json";
import { getCountry } from "./setStyles";

export default function Logo({ width = null, height = 100, src = null }) {
  const countryCode = getCountry();
  if (src == null) {
    src = "/logos/" + config[countryCode].logo;
  }
  if (width == null) {
    width = config[countryCode].logoWidth;
  }
  if (height == null) {
    height = config[countryCode].logoHeight;
  }
  return (
    <div className="logo">
      <Image alt="Next.js logo" src={src} width={width} height={height} />
    </div>
  );
}
