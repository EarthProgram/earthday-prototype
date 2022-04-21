import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useTranslation } from "next-i18next";
import { getAddress, getBalance } from "../utils/utils";

export default function CustomQRCode({ isScan = true, ondata = (data) => {} }) {
  const [data, setData] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

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
          <>
            <QRCodeSVG value={address ?? ""} size={200} />
            <p className="txt txt-box"> {t("yourAddress") + address}</p>
          </>
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
          <p className="txt txt-box">{data}</p>
        </>
      )}
      {!isLoading && (
        <p className="txt txt-box">
          {(t("earthDayBalance") ?? "") + balance.toString() + " tokens"}
        </p>
      )}
      <p className="error txt-box">{isScan && data ? "" : error}</p>
    </div>
  );
  async function getBalanceData() {
    const bal = (await getBalance()) ?? 0;
    if (!bal || bal < 1) {
      setError(t("noBalance"));
      clearTimeout(timeoutID);
      return;
    }
    setBalance(bal);
    setIsLoading(false);
  }

  async function getPubkey1() {
    console.log("fetching..");
    try {
      const addrss = await getAddress();
      const bal = (await getBalance()) ?? 0;
      setBalance(bal);
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
