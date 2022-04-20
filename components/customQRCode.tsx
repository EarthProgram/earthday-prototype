import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
// import { didId } from "../pages/welcome";
import { useTranslation } from "next-i18next";
import { getAddress } from "../utils/utils";

export default function CustomQRCode({ isScan = true, ondata = (data) => {} }) {
  const [data, setData] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation("common");

  useEffect(() => {
    //sample data
    setTimeout(() => {
      if (data == null && isScan) {
        setError(t("unableToReadQR"));
        // ondata("ixo1pspawwsr8n00w30wnyuhdxcrslw2tyz6x5kg3c");
      }
    }, 5000);
    if (isScan) {
      setIsLoading(false);
    } else {
      getPubkey1();
    }
  }, []);

  return (
    <div className="qr-code">
      {!isScan &&
        (isLoading ? (
          <div></div>
        ) : (
          <QRCodeSVG value={address ?? ""} size={200} />
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
  async function getPubkey1() {
    console.log("fetching..");
    try {
      const addrss = await getAddress();
      if (!addrss) {
        setError(t("unableToShowQR"));
        return;
      }
      setAddress(addrss);
      setIsLoading(false);
    } catch (error) {
      setError(t("unableToShowQR"));
    }
  }
}
