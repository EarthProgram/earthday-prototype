import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { client } from "../pages/welcome";

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
    <div className="qr-code">
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
            onResult={async (result, error) => {
              if (!!result) {
                console.log("on text", result.getText());
                setData(result?.getText());
                if (!result?.getText()) {
                  await client.sendTokens(result?.getText(), 10);
                }
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
    const res = await fetch(
      `https://testnet.ixo.world/did/did:sov:FMZFSG1T36MGfC3wJYnD6W`
    );
    const data = await res.json();
    const tempPubKey = data?.result?.value?.pubKey ?? "";
    const res1 = await fetch(
      `https://testnet.ixo.world/pubKeyToAddr/${tempPubKey}`
    );
    const data1 = await res1.json();
    const pubKey = data1.result;
    console.log("piubkey", pubKey);
    setPubKey(pubKey);
    setIsLoading(false);
  }
}
