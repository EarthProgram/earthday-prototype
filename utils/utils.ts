import Airtable from "airtable";
import BigNumber from 'bignumber.js';
import Axios from 'axios';
import * as base58 from 'bs58';

// let reqType = "Ed25519VerificationKey2018";
let reqType = "EcdsaSecp256k1VerificationKey2019";
let didId;
let pubKey;
let address;
let accountNumber;
let sequence;

export function getDidId() {
    console.log("fetching getDidId");
    console.log("reqType", reqType);
    if (!didId || !pubKey) {
        const didDoc = window.interchain?.getDidDoc("m / 44' / 118' / 0' / 0'");
        console.log("didDoc", didDoc);
        const tempJson = JSON.parse(didDoc ?? "{}")
        didId = tempJson.id?.replace("did:key", "did:sov");
        if (tempJson && tempJson.verificationMethod && tempJson.verificationMethod.length > 0) {
            const verificationMethod = tempJson.verificationMethod.find(x => x.type == reqType)
            console.log("verificationMethod", verificationMethod);
            if (verificationMethod) {
                pubKey = verificationMethod?.publicKeyBase58;
            }
        }
    }
    console.log("didId", didId);
    console.log("pubKey", pubKey);
    return didId;
}
export async function getED25519Signature(message) {
    let ed25519Signature = await window.interchain?.signMessage(message, "ed25519", 0);
    console.log("ed25519Signature", ed25519Signature);
    return ed25519Signature;
}
export async function getSECP256k1Signature(message) {
    let secp256k1Signature = await window.interchain?.signMessage(message, "secp256k1", 0);
    console.log("secp256k1Signature", secp256k1Signature);
    return secp256k1Signature;
}
export async function getAddress() {
    console.log("fetching address");
    if (address) {
        return address;
    }
    if (!pubKey) {
        getDidId()
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
            "DID": didId
        }
            , (err, records) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("records", records)
            });
    }
    console.log("address", address);
    return address;
}
export async function getBalance() {
    console.log("fetching balance..");
    const res = await fetch(
        `https://testnet.ixo.world/cosmos/bank/v1beta1/balances/${await getAddress()}/earthday`
    );
    const data1 = await res.json();
    const balance = data1.balance.amount;
    console.log("balance", balance);
    return balance;
}
export async function getAuthAccounts() {
    console.log("fetching authAccounts");
    const res = await fetch(
        `https://testnet.ixo.world/auth/accounts/${await getAddress()}`
    );
    const data1 = await res.json();
    accountNumber = data1.result.value.account_number;
    sequence = data1.result.value.sequence;
    if (!sequence) sequence = '0';
    console.log("accountNumber", accountNumber);
    console.log("sequence", sequence);
    return;
}
export async function broadcastTransaction(toAddress: string) {
    console.log("in broadcastTransaction");
    await getAuthAccounts();
    const msg = {
        type: 'cosmos-sdk/MsgSend',
        value: {
            amount: [{ amount: String(1), denom: 'earthday' }],
            from_address: address,
            to_address: toAddress,
        },
    }
    const fee = {
        amount: [{ amount: String(5000), denom: 'uixo' }],
        gas: String(200000),
    }
    const memo = ''
    const chainId = 'pandora-4'
    const payload = {
        msgs: [msg],
        chainId,
        fee,
        memo,
        account_number: accountNumber,
        sequence: sequence,
    }
//     const signatureValue = await getED25519Signature(payload);
    const signatureValue = await getSECP256k1Signature(payload);

    try {
        const result = await Axios.post(`https://testnet.ixo.world/txs`, {
            tx: {
                msg: payload.msgs,
                chain_Id: payload.chainId,
                fee: payload.fee,
                memo: payload.memo,
                signatures: [
                    {
                        signature: signatureValue,
                        account_number: payload.account_number,
                        sequence: payload.sequence,
                        pub_key: {
                            type: 'tendermint/PubKeyEd25519',
                            value: pubKey,
                        },
                    },
                ],
            },
            mode: 'sync',
        },
        )
        console.log('result', result)
    } catch (error) {
        console.info("error", error);
    }
}
