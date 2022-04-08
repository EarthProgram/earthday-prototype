import Image from "next/image";

// const customLoader = ({ src }) => {
//   return src;
// };

export default function Logo({
  width = 600,
  height = 200,
  src = "/nextjs.png",
}) {
  return (
    <Image
      alt="Next.js logo"
      src={src}
      unoptimized={true}
      width={width}
      height={height}
      // loader={customLoader}
    />
  );
}
