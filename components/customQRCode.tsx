import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";

export default function CustomQRCode({ isScan = true }) {
  const [data, setData] = useState("");
  const [pubKey, setPubKey] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isScan) {
      setIsLoading(false);
    } else {
      getPubkey();
    }
  }, []);

  return (
    <div
      style={{
        width: 255,
        height: 255,
        alignSelf: "center",
        display: "inline-table",
      }}
    >
      {!isScan &&
        (isLoading ? (
          <div></div>
        ) : (
          <QRCodeSVG
            value={pubKey ?? "https://operatest.ixo.earth/"}
            size={200}
          />
        ))}
      {isScan && (
        <>
          <QrReader
            videoStyle={{ height: "80%" }}
            onResult={(result, error) => {
              if (!!result) {
                console.log("on text", result.getText());
                setData(result?.getText());
              }

              if (!!error) {
                console.info(error);
              }
            }}
            constraints={{ facingMode: "environment" }}
          />
          <p>{data}</p>
        </>
      )}
    </div>
  );
  async function getPubkey() {
    const res = await fetch(`https://jsonkeeper.com/b/LNJA`);
    const data = await res.json();
    const pubKey =
      data?.result?.value?.pubKey ?? "https://operatest.ixo.earth/";
    setPubKey(pubKey);
    setIsLoading(false);
  }
}
