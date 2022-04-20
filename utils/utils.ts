import Airtable from "airtable";
import BigNumber from 'bignumber.js';
import Axios from 'axios';
import * as base58 from 'bs58';

let didId;
let pubKey;
let address;
let signEd25519;
let accountNumber;
let sequence;

export function getDidId() {
    // did: FMZFSG1T36MGfC3wJYnD6W
    if (!didId || !pubKey) {
        const tempDid = window.interchain?.getDidDoc("m / 44' / 118' / 0' / 0'");
        const tempJson = JSON.parse(tempDid ?? "{}")
        didId = tempJson.id?.replace("did:key", "did:sov");
        if (tempJson && tempJson.verificationMethod && tempJson.verificationMethod.length > 0) {
            const reqType = "Ed25519VerificationKey2018"
            const verificationMethod = tempJson.verificationMethod.find(x => x.type == reqType)
            if (verificationMethod) {
                pubKey = verificationMethod?.publicKeyBase58;
            }
        }
    }
    // if (!didId) {
    //     didId = "did:sov:FMZFSG1T36MGfC3wJYnD6W";
    // }
    //write didId to airtable
    console.log("didId", didId);
    return didId;
}
export async function getSignEd25519() {
    // original_json_message = '{"key1": "value1", "key2": "this entire textToSign can be any string really"}'
    // signature: 4b261d158804c08c10571bf30dbe7d3e7ff2f238af0ecd08f1666eb725d9ce00cc970f6798a9ce7ba6a5f90dfeb61537efe7e2a8cd1d84e35b79f6136cc0a30c
    if (!signEd25519) {
        const message = didId;
        signEd25519 = await window?.interchain?.signMessage(message, "ed25519", 0);
    }
    console.log("signEd25519", signEd25519);
    return signEd25519;
}
export async function getSignSecp256k1(message) {
    let secp256k1 = await window.interchain?.signMessage(message, "secp256k1", 20);
    console.log("signSecp256k1", secp256k1);
    return secp256k1;
}

export async function getAddress() {
    console.log("fetching..");
    if (!pubKey) {
        return null;
    }
    if (address) {
        return address;
    }
    const res = await fetch(
        `https://testnet.ixo.world/pubKeyToAddr/${pubKey}`
    );
    const data1 = await res.json();
    address = data1.result;
    if (address) {
        const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_KEY);
        base('Table 1').create({
            "Wallet": address,
        }
            , (err, records) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("records", records)
            });
    }
    return address;

}
export async function getBalance() {
    console.log("fetching balance..");
    const res = await fetch(
        `https://testnet.ixo.world/cosmos/bank/v1beta1/balances/${address}/earthday`
    );
    const data1 = await res.json();
    const balance = data1.balance.amount;
    return balance;
}

export async function getAuthAccounts() {
    console.log("fetching..");
    const res = await fetch(
        `https://testnet.ixo.world/auth/accounts/${address}`
    );
    const data1 = await res.json();
    accountNumber = data1.result.value.account_number;
    sequence = data1.result.value.sequence;

    console.log("accountNumber", accountNumber);
    console.log("sequence", sequence);

    return;
}

export async function broadcastTransaction() {

    getAuthAccounts();

    const publicKey = base58.decode(pubKey).toString('base64')
    const msg = {
        type: 'cosmos-sdk/MsgSend',
        value: {
          amount: [{ amount: new BigNumber(1).times(new BigNumber(10).pow(6)).toString(), denom: 'uixo' }],
          from_address: address,
          to_address: 'ixo1wfvqcamfzqq6y0j75r3n9ascj3tuvup3jqtnwc',
        },
    }
    const fee = {
        amount: [{ amount: String(5000), denom: 'uixo' }],
        gas: String(200000),
    }
    const memo = ''
    const payload = {
        msgs: [msg],
        chain_id: 'pandora-4',
        fee,
        memo,
        account_number: accountNumber, //String('20'),
        sequence: sequence, //String('749'),
    }
    const signatureValue = getSignSecp256k1(payload);

    try {
        console.log({
            tx: {
              msg: payload.msgs,
              fee: payload.fee,
              signatures: [
                {
                  account_number: payload.account_number,
                  sequence: payload.sequence,
                  signature: signatureValue,
                  pub_key: {
                    type: 'tendermint/PubKeyEd25519',
                    value: publicKey,
                  },
                },
              ],
              memo: payload.memo,
            },
            mode: 'sync',
          })

        Axios.post(`https://testnet.ixo.world/txs`, {
            tx: {
              msg: payload.msgs,
              fee: payload.fee,
              signatures: [
                {
                  account_number: payload.account_number,
                  sequence: payload.sequence, 
                  signature: signatureValue,
                  pub_key: {
                    type: 'tendermint/PubKeyEd25519',
                    value: publicKey,
                  },
                },
              ],
              memo: payload.memo,
            },
            mode: 'sync',
          },
        )
    } catch (error) {
        console.info(error);
    }
}
