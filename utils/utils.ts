export let didId;

export function getDidDoc() {
    // did: FMZFSG1T36MGfC3wJYnD6W

    if (!window["ixoKs"]) {
        // setdidDoc(interchain.getDidDoc("m / 44' / 118' / 0' / 0'"));
        console.log("geting diddoc intercain", window.interchain);
        const tempDid = window.interchain?.getDidDoc("m / 44' / 118' / 0' / 0'");
        if (tempDid) {
            const didJson = JSON.parse(tempDid);
            didId = didJson?.id?.replace("did:key", "did:sov");
        }
        if (!didId) {
            didId = "did:sov:FMZFSG1T36MGfC3wJYnD6W";
        }
        console.log("didId", didId);
    }
    // if (window["ixoKs"]) {
    //   ixoKsProvider.getDidDoc((error: any, response: any) => {
    //     if (error) {
    //       // handle error
    //     } else {
    //       setdidDoc(JSON.stringify(response));
    //     }
    //   });
    // }
}
export async function broadcastTransaction() {
    // did: FMZFSG1T36MGfC3wJYnD6W
    try {
        //@ts-ignore
        // if (!wallet) {
        //   wallet = await makeWallet();
        //   // "planet stomach collect august notice lend horse bread pudding hour travel main"
        // }
        // if (!client) {
        //   client = makeClient(
        //     wallet,
        //     "https://testnet.ixo.world/rest",
        //     "https://blocksync-pandora.ixo.world"
        //   );
        //   await client.register();
        // }

        // wallet= wallet
    } catch (error) {
        console.info(error);
    }
    // console.log("wallet", wallet);
    // console.log("client", client);
}
export async function signEd25519() {
    // original_json_message = '{"key1": "value1", "key2": "this entire textToSign can be any string really"}'
    // signature: 4b261d158804c08c10571bf30dbe7d3e7ff2f238af0ecd08f1666eb725d9ce00cc970f6798a9ce7ba6a5f90dfeb61537efe7e2a8cd1d84e35b79f6136cc0a30c
    const message =
        "7b226b657931223a202276616c756531222c20226b657932223a20227468697320656e746972652074657874546f5369676e2063616e20626520616e7920737472696e67207265616c6c79227d";

    const res = await window?.interchain?.signMessage(message, "ed25519", 0);
    console.log("signEd25519", res);
}
export async function signSecp256k1() {
    // signature: RPswIGUv99n7kuLm3o5ecH9nDJpXdOuTkC9+WBvBOd0rtNY2A58+FtMnUK1U2o7FeIheWfLVNt1UlJ8P/hrjmA==
    const message =
        "5f0c463c1d8eaeee725678c195812213214b81701d45e721c860df8152e9a3af";
    const res = await window.interchain.signMessage(message, "secp256k1", 20);
    console.log("signSecp256k1", res);
}