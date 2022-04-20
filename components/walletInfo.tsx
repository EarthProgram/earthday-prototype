import { useEffect, useState } from "react";
import { getDidId, getSignEd25519, getSignSecp256k1 } from "../utils/utils";
import { useTranslation } from "next-i18next";

export default function WalletInfo({ onLoad = (isError) => {} }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [didId, setDidId] = useState(null);
  // const [signEd25519Id, setSignEd25519] = useState(null);
  // const [signSecp256k1Id, setSignSecp256k1] = useState(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    init();
  }, []);
  return (
    !isLoading &&
    (isError ? (
      <p className="error">{t("walletError")}</p>
    ) : (
      <div className="did-doc">
        <h2>didId</h2>
        <p>{didId}</p>
        {/* <h2>signEd25519</h2>
        <p>{signEd25519Id}</p>
        <h2>signSecp2256k1</h2>
        <p>{signSecp256k1Id}</p> */}
      </div>
    ))
  );
  async function init() {
    try {
      const tempDidId = getDidId();
      // const tempSignEd25519 = await getSignEd25519();
      // const tempSignSecp256k1 = await getSignSecp256k1();
      if (
        !tempDidId
        //  || !tempSignEd25519 || !tempSignSecp256k1
      ) {
        setIsError(true);
        setIsLoading(false);
        onLoad(true);
        return;
      }
      setDidId(tempDidId);
      // setSignEd25519(tempSignEd25519);
      // setSignSecp256k1(tempSignSecp256k1);
      setIsLoading(false);
      onLoad(false);
    } catch (error) {
      console.log("error", error);
      setIsError(true);
      setIsLoading(false);
      onLoad(true);
    }
  }
}
