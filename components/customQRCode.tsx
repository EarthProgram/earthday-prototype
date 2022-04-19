import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { didId } from "../pages/welcome";

export default function CustomQRCode({ isScan = true, ondata = (data) => {} }) {
  const [data, setData] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    //sample data
    console.log("diddd ", didId);
    setTimeout(() => {
      if (!data) {
        setError("Unable to read the QR code.");
        // ondata("ixo1pspawwsr8n00w30wnyuhdxcrslw2tyz6x5kg3c");
      }
    }, 5000);
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
                if (result.getText() != null) {
                  setData(result?.getText());
                  ondata(result?.getText());
                  setError(null);
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
      <p className="error">{error}</p>
    </div>
  );
  async function getPubkey() {
    console.log("fetching..");
    console.log("didID", didId);
    // setError("Unable to Show the QR code");

    if (!didId) {
      setError("Unable to Show the QR code");
      return;
    }
    try {
      const res = await fetch(`https://testnet.ixo.world/did/${didId}`);
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
    } catch (error) {
      setError("Unable to Show the QR code");
    }
  }
}
