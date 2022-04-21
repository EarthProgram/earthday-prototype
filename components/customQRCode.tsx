import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
// import { didId } from "../pages/welcome";
import { useTranslation } from "next-i18next";
import { getAddress, getBalance } from "../utils/utils";

export default function CustomQRCode({ isScan = true, ondata = (data) => {} }) {
  const [data, setData] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation("common");
  let timeoutID;
  useEffect(() => {
    //sample data
    timeoutID = setTimeout(function () {
      if (data == null && isScan && !error) {
        console.log("data", data, "error", error);
        setError(t("unableToReadQR"));
      }
    }, 5000);
    if (isScan) {
      // setIsLoading(false);
      getBalanceData();
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
      {isScan && !isLoading && (
        <>
          <QrReader
            videoStyle={{ height: "80%" }}
            onResult={async (result, error) => {
              if (!!result) {
                console.log("on text", result.getText());
                if (result.getText() != null) {
                  setData(result?.getText());
                  clearTimeout(timeoutID);
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
  async function getBalanceData() {
    const bal = (await getBalance()) ?? 0;
    // if (!bal || bal < 1) {
    //   setError(t("noBalance"));
    //   clearTimeout(timeoutID);
    //   return;
    // }
    setIsLoading(false);
  }

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
