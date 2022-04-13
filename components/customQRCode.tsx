import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function CustomQRCode({ isScan = true, pubKey = null }) {
  const [data, setData] = useState("");

  return (
    <div
      style={{
        width: 255,
        height: 255,
        alignSelf: "center",
        display: "inline-table",
      }}
    >
      {!isScan && (
        <QRCodeSVG
          value={pubKey ?? "https://operatest.ixo.earth/"}
          size={200}
        />
      )}
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
}
