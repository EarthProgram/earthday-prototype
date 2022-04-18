import Image from "next/image";
import constants from "../constants/constant.json";
import { getCountry } from "./setStyles";

export default function Logo({ width = null, height = 100, src = null }) {
  const countryCode = getCountry();
  if (src == null) {
    src = "/logos/" + constants[countryCode].logo;
  }
  if (width == null) {
    width = constants[countryCode].logoWidth;
  }
  if (height == null) {
    height = constants[countryCode].logoHeight;
  }
  return (
    <div className="logo">
      <Image alt="Next.js logo" src={src} width={width} height={height} />
    </div>
  );
}
