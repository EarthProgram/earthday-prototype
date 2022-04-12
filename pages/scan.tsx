import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrReader } from "react-qr-reader";

export default function Scan() {
  const [mounted, setMounted] = useState(false);
  const [isScan, setIsScan] = useState(false);

  const [data, setData] = useState("");

  useEffect(() => {
    setMounted(true);
  });
  return (
    mounted && (
      <div className="container">
        <div
          style={{
            justifyContent: "end",
            flexDirection: "column",
            height: "80vh",
            display: "flex",
          }}
        >
          <div style={{ width: 320, height: "55vh", alignSelf: "center" }}>
            {!isScan && <QRCodeSVG value="https://operatest.ixo.earth/"  size={250}/>}
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
                setIsScan(!isScan);
              }}
            >
              {isScan ? "Generate QR code" : "Scan QR code"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
