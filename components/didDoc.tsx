import { useEffect, useState } from "react";
import { getDidDoc, signEd25519, signSecp256k1 } from "../utils/utils";

export default function DidDoc() {
  const [didDoc, setDidDoc] = useState(null);
  const [signEd25519Id, setSignEd25519] = useState(null);
  const [signSecp256k1Id, setSignSecp256k1] = useState(null);

  useEffect(() => {
    setDidDoc(getDidDoc());
    signEd25519().then((res) => {
      setSignEd25519(res);
    });
    signSecp256k1().then((res) => {
      setSignSecp256k1(res);
    });
  }, []);
  return (
    <div>
      <h2>didDoc</h2>
      <p>{didDoc}</p>
      <h2>signEd25519</h2>
      <p>{signEd25519Id}</p>
      <h2>signSech2256k1</h2>
      <p>{signSecp256k1Id}</p>
    </div>
  );
}
