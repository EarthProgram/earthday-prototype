export let didId;

export function getDidDoc() {
    // did: FMZFSG1T36MGfC3wJYnD6W
    console.log("geting diddoc intercain", window.interchain);
    const tempDid = window.interchain?.getDidDoc("m / 44' / 118' / 0' / 0'");
    if (tempDid) {
        const didJson = JSON.parse(tempDid);
        didId = didJson?.id?.replace("did:key", "did:sov");
    }
    // if (!didId) {
    //     didId = "did:sov:FMZFSG1T36MGfC3wJYnD6W";
    // }
    console.log("didId", didId);
    return didId;
}
export async function broadcastTransaction() {
    // did: FMZFSG1T36MGfC3wJYnD6W
    try {
        //@ts-ignore

    } catch (error) {
        console.info(error);
    }
}
export async function signEd25519() {
    // original_json_message = '{"key1": "value1", "key2": "this entire textToSign can be any string really"}'
    // signature: 4b261d158804c08c10571bf30dbe7d3e7ff2f238af0ecd08f1666eb725d9ce00cc970f6798a9ce7ba6a5f90dfeb61537efe7e2a8cd1d84e35b79f6136cc0a30c
    const message = didId;
    const res = await window?.interchain?.signMessage(message, "ed25519", 0);
    console.log("signEd25519", res);
    return res;
}
export async function signSecp256k1() {
    // signature: RPswIGUv99n7kuLm3o5ecH9nDJpXdOuTkC9+WBvBOd0rtNY2A58+FtMnUK1U2o7FeIheWfLVNt1UlJ8P/hrjmA==
    const message =
    {
        chainId: "pandora-4",
        chainName: "ixo testnet",
        rpc: "https://testnet.ixo.world/rpc",
        rest: "https://testnet.ixo.world/rest",
        stakeCurrency: {
            coinDenom: "EARTHDAY",
            coinMinimalDenom: "uearthday",
            coinDecimals: 6,
        },
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "ixo",
            bech32PrefixAccPub: "ixopub",
            bech32PrefixValAddr: "ixovaloper",
            bech32PrefixValPub: "ixovaloperpub",
            bech32PrefixConsAddr: "ixovalcons",
            bech32PrefixConsPub: "ixovalconspub"
        },
        currencies: [{
            coinDenom: "EARTHDAY",
            coinMinimalDenom: "uearthday",
            coinDecimals: 6,
        }],
        feeCurrencies: [{
            coinDenom: "EARTHDAY",
            coinMinimalDenom: "uearthday",
            coinDecimals: 6,
        }],
        coinType: 118,
        gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04
        }
    };
    const res = await window.interchain?.signMessage(message, "secp256k1", 20);
    console.log("signSecp256k1", res);
    return res;

}

export async function getPubkey() {
    console.log("fetching..");
    console.log("didID", didId);
    // setError("Unable to Show the QR code");
    const res = await fetch(`https://testnet.ixo.world/did/${didId}`);
    const data = await res.json();
    const tempPubKey = data?.result?.value?.pubKey ?? "";
    const res1 = await fetch(
        `https://testnet.ixo.world/pubKeyToAddr/${tempPubKey}`
    );
    const data1 = await res1.json();
    const pubKey = data1.result;
    return pubKey;

}