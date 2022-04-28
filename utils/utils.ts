import Airtable from "airtable";
import BigNumber from 'bignumber.js';
import Axios from 'axios';
import * as base58 from 'bs58';
import { encodeSecp256k1Pubkey, pubkeyToAddress, pubkeyType} from "@cosmjs/amino";

const prefix = 'ixo'
const pubKeyTypeSECP256k1 = "EcdsaSecp256k1VerificationKey2019"
const pubKeyTypeED25519 = "Ed25519VerificationKey2018"

function getDIDDoc() {
    const didDoc = window.interchain?.getDidDoc(0)
    console.log("didDoc", didDoc)
    return didDoc
}

function getVerificationMethod() {
    const verificationMethod = getDIDDoc().verificationMethod
    console.log("verificationMethod", verificationMethod)
    return verificationMethod
}

function getPubKeyType() {
    return pubkeyType.secp256k1
}

function getPubKey() {
    const publicKeyBase58 = getVerificationMethod().find(x => x.type == getPubKeyType()).publicKeyBase58
    console.log("publicKeyBase58", publicKeyBase58)
}

export function getDIDId() {
    const didDoc = JSON.parse(getDIDDoc())
    console.log("didDoc.id",didDoc.id)
    return didDoc.id;
}

export async function getAddress() {
    pubkeyToAddress(getPubKey(), prefix)
    // const res = await fetch(
    //     `https://testnet.ixo.world/publicKeyToAddr/${publicKey}`
    // );
    // const data1 = await res.json();
    // address = data1.result;
    // if (address) {
    //     const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_KEY);
    //     base('Table 1').create({
    //         "Wallet": address,
    //         "DID": didId
    //     }
    //         , (err, records) => {
    //             if (err) {
    //                 console.error(err);
    //                 return;
    //             }
    //             console.log("records", records)
    //         });
    // }
    // console.log("address from blockchain API", address);
    // return address;
}

function get() {
    if (tempJson && tempJson.verificationMethod && tempJson.verificationMethod.length > 0) {
    }
    console.log("pubKey returned by Opera", publicKey);
    return didId;
}
async function getED25519Signature(message) {
    let ed25519Signature = await window.interchain?.signMessage(message, "ed25519", 0);
    console.log("ed25519Signature", ed25519Signature);
    return ed25519Signature;
}
async function getSECP256k1Signature(message) {
    let secp256k1Signature = await window.interchain?.signMessage(message, "secp256k1", 0);
    console.log("secp256k1Signature", secp256k1Signature);
    return secp256k1Signature;
}
async function getBalance() {
    console.log("fetching balance..");
    const res = await fetch(
        `https://testnet.ixo.world/cosmos/bank/v1beta1/balances/${await getAddress()}/earthday`
    );
    const data1 = await res.json();
    const balance = data1.balance.amount;
    console.log("balance from blockchain API", balance);
    return balance;
}
async function getAuthAccounts() {
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
    // const signatureValue = await getED25519Signature(payload);
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
                            type: 'tendermint/PublicKeyEd25519',
                            value: publicKey,
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
