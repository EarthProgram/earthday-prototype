import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrReader } from "react-qr-reader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Scan() {
  const [mounted, setMounted] = useState(false);
  const [isScan, setIsScan] = useState(false);

  const [data, setData] = useState("");
  const { t } = useTranslation("common");

  useEffect(() => {
    setMounted(true);
  });
  return (
    mounted && (
      <div className="container">
        <h3>{isScan ? t("explainShowQRCode") : t("explainScanQRCode")}</h3>
        <div
          style={{
            justifyContent: "end",
            flexDirection: "column",
            height: "75vh",
            display: "flex",
          }}
        >
          <div style={{ width: 320, height: "55vh", alignSelf: "center" }}>
            {!isScan && (
              <QRCodeSVG value="https://operatest.ixo.earth/" size={250} />
            )}
            {isScan && (
              <>
                <QrReader
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
          <div>
            <button
              className="bttn"
              onClick={() => {
                if (!!data) {
                  setData(null);
                }
                setIsScan(!isScan);
              }}
            >
              {isScan ? t("showQRCode") : t("scanQRCode")}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
