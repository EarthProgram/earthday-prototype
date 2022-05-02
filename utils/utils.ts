import Airtable from "airtable"
import BigNumber from 'bignumber.js'
import Axios from 'axios'
import * as base58 from 'bs58'
import { encodeSecp256k1Pubkey, pubkeyToAddress, pubkeyType} from "@cosmjs/amino"

const prefix = 'ixo'
const messageType = 'cosmos-sdk/MsgSend'
const chainId = 'pandora-4'
const pubKeyTypeSECP256k1 = "EcdsaSecp256k1VerificationKey2019"
const signMethodSECP256k1 = "secp256k1"
// const pubKeyTypeED25519 = "Ed25519VerificationKey2018"
// const signMethodED25519 = "ed25519"
let address

function getDIDDocJSON() {
    const didDoc = window.interchain?.getDidDoc(0)
    console.log("didDoc", didDoc)
    const didDocJSON = JSON.parse(didDoc ?? "{}")
    console.log("didDocJSON", didDocJSON)
    return didDocJSON
}

function getPubKeyTypeForDIDDoc() {
    const pubkeyTypeBlockScope = pubKeyTypeSECP256k1
    console.log("pubkeyTypeBlockScope", pubkeyTypeBlockScope)
    return pubkeyTypeBlockScope
}

function getVerificationMethod() {
    const verificationMethod = getDIDDocJSON().verificationMethod.find(x => x.type == getPubKeyTypeForDIDDoc())
    console.log("verificationMethod", verificationMethod)
    return verificationMethod
}

function getPublicKeyBase58() {
    const publicKeyBase58 = getVerificationMethod().publicKeyBase58
    console.log("publicKeyBase58", publicKeyBase58)
    return publicKeyBase58
}

function getPubKeyUint8Array() {
    const pubKeyUint8Array = base58.decode(getPublicKeyBase58())
    console.log("pubKeyUint8Array", pubKeyUint8Array)
    return pubKeyUint8Array
}

function getPubKey() {
    const pubKey = encodeSecp256k1Pubkey(getPubKeyUint8Array())
    console.log("pubKey", pubKey)
    return pubKey
}

function getFromAddress() {
    return getAddress()
}

function getDIDId() {
    const didDoc = JSON.parse(getDIDDocJSON())
    console.log("didDoc.id",didDoc.id)
    return didDoc.id;
}

function addressAPICall() {
    // const res = await fetch(
    //     `https://testnet.ixo.world/publicKeyToAddr/${publicKey}`
    // );
    // const data1 = await res.json();
    // address = data1.result;
    // if (address) {
    // console.log("address from blockchain API", address);
    // return address;
}

function writeToAirTable() {
    // const base = new Airtable(
    //     { apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_KEY);
    // base('Table 1').create({
    //     "Wallet": getAddress(),
    //     "DID": getDIDId()
    // }
    //     , (err, records) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }
    //         console.log("records", records)
    //     });
}

async function getAuthAccounts() {
    const fetchResult = await fetch(`https://testnet.ixo.world/auth/accounts/${await getAddress()}`);
    console.log("fetchResult", fetchResult)
    const authAccounts = await fetchResult.json();
    console.log("authAccounts", authAccounts)
    return authAccounts;
}

function getSignMethod() {
    const signMethod = signMethodSECP256k1
    console.log("signMethod", signMethod)
    return signMethod
}

function getAddressIndex() {
    const addressIndex = 0
    console.log("addressIndex", addressIndex)
    return addressIndex
}

function signMessage(payload) {
    const signedMessage = window.interchain.signMessage(payload, getSignMethod(), getAddressIndex())
    console.log("signedMessage", signedMessage)
    return signedMessage
}

async function getAccountNumber(authAccounts) {
    const accountNumber = authAccounts.result.value.account_number;
    console.log("accountNumber", accountNumber)
    return accountNumber
}

async function getSequence(authAccounts) {
    let sequence = authAccounts.result.value.sequence;
    if (!sequence) sequence = '0';
    console.log("sequence", sequence)
    return sequence
}

function getPayload(toAddress: string) {
    const fromAddress = getFromAddress()
    const authAccounts = getAuthAccounts()
    const accountNumber = getAccountNumber(authAccounts)
    const sequence = getSequence(authAccounts)
    const msg = {
        type: messageType,
        value: {
            amount: [{ amount: String(1), denom: 'earthday' }],
            from_address: fromAddress,
            to_address: toAddress,
        },
    }
    console.log("msg", msg)
    const fee = {
        amount: [{ amount: String(5000), denom: 'uixo' }],
        gas: String(200000),
    }
    console.log("fee", fee)
    const memo = ''
    console.log("memo", memo)
    const payload = {
        msgs: [msg],
        chainId,
        fee,
        memo,
        account_number: accountNumber,
        sequence: sequence,
    }
    console.log("payload", payload)
    return payload
}

export async function getAddress() {
    if (address) return address
    address = pubkeyToAddress(getPubKey(), prefix) 
    console.log("address", address)
    return address
}

export async function getBalance() {
    const res = await fetch(`https://testnet.ixo.world/cosmos/bank/v1beta1/balances/${getAddress()}/earthday`);
    const data1 = await res.json();
    const balance = data1.balance.amount;
    console.log("balance from blockchain API", balance);
    return balance;
}

export async function broadcastTransaction(toAddress: string) {
    const payload = getPayload(toAddress)
    const signatureValue = signMessage(payload)
    const pubKeyType = getPubKey().type
    const pubKeyValue = getPubKey().value
    const postResult = await Axios.post(`https://testnet.ixo.world/txs`, {
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
                        type: pubKeyType,
                        value: pubKeyValue,
                    },
                },
            ],
        },
        mode: 'sync',
    },
    )
    console.log('postResult', postResult)
}
