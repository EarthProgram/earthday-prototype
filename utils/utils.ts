import Airtable from "airtable"
import BigNumber from 'bignumber.js'
import Axios from 'axios'
import * as base58 from 'bs58'
import { encodeSecp256k1Pubkey, pubkeyToAddress, pubkeyType } from "@cosmjs/amino"
import { signPayloadWithCosmJSAmino } from "./operatest"

const prefix = 'ixo'
const EARTHDAY = 'earthday'
const messageType = 'cosmos-sdk/MsgSend'
const chainId = 'pandora-4'
const addressIndex = 0
const pubKeyTypeSECP256k1 = "EcdsaSecp256k1VerificationKey2019"
const signMethodSECP256k1 = "secp256k1"
// const PED25519 = "Ed25519VerificationKey2018"
// const signMethodED25519 = "ed25519"
let didDoc
let didDocJSON
let pubKey
let address

function getPubKeyType() {
    const localPubKeyType = pubKeyTypeSECP256k1
    console.log("localPubKeyType", localPubKeyType)
    return localPubKeyType
}

function getSignMethod() {
    const signMethod = signMethodSECP256k1
    console.log("signMethod", signMethod)
    return signMethod
}

function getDidDoc() {
    if (didDoc) return didDoc
    didDoc = window.interchain.getDidDoc(0)
    console.log("didDoc", didDoc)
    return didDoc
}

function getDIDDocJSON() {
    if (didDocJSON) return didDocJSON
    const localDidDoc = getDidDoc()
    didDocJSON = JSON.parse(localDidDoc ?? "{}")
    console.log("didDocJSON", didDocJSON)
    return didDocJSON
}

function getVerificationMethod() {
    const verificationMethod = getDIDDocJSON().verificationMethod.find(x => x.type == getPubKeyType())
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

function encodeSecp256k1PubkeyLocal() {
    if (pubKey) return pubKey
    pubKey = encodeSecp256k1Pubkey(getPubKeyUint8Array())
    console.log("pubKey", pubKey)
    return pubKey
}

function getAddress() {
    if (address) return address
    address = pubkeyToAddress(encodeSecp256k1PubkeyLocal(), prefix) 
    console.log("address", address)
    return address
}

function getFromAddress() {
    return getAddress()
}

async function getBalance(denom) {
    const fetchResult = await fetch(`https://testnet.ixo.world/cosmos/bank/v1beta1/balances/${getAddress()}/${denom}`)
    const balanceJSON = await fetchResult.json()
    console.log("balanceJSON", balanceJSON)
    return balanceJSON.balance.amount
}

async function getAuthAccountsJSON() {
    const fetchResult = await fetch(`https://testnet.ixo.world/auth/accounts/${await getAddress()}`)
    const authAccountsJSON = await fetchResult.json()
    console.log("authAccountsJSON", authAccountsJSON)
    return authAccountsJSON;
}

function getAccountNumber(authAccountsJSON) {
    const accountNumber = authAccountsJSON.result.value.account_number;
    console.log("accountNumber", accountNumber)
    return accountNumber
}

function getSequence(authAccountsJSON) {
    let sequence = authAccountsJSON.result.value.sequence;
    if (!sequence) sequence = '0';
    console.log("sequence", sequence)
    return sequence
}

async function signPayloadWithOpera(payload) {
    const signedMessage = await window.interchain.signMessage(payload, getSignMethod(), addressIndex)
    console.log("signedMessage", signedMessage)
    return signedMessage
}

async function signPayload(payload, isOpera: boolean) {
    if (isOpera) return await signPayloadWithOpera(payload)
    return await signPayloadWithCosmJSAmino(payload)
}

async function getPayload(toAddress: string) {
    const fromAddress = getFromAddress()
    const authAccountsJSON = await getAuthAccountsJSON()
    const accountNumber = getAccountNumber(authAccountsJSON)
    const sequence = getSequence(authAccountsJSON)
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

async function broadcast(toAddress: string, isOpera: boolean) {
    const payload = await getPayload(toAddress)
    const signatureValue = await signPayload(payload, isOpera)
    const localPubKeyType = pubkeyType.secp256k1
    const localPubKeyValue = getPublicKeyBase58()
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
                        type: localPubKeyType,
                        value: localPubKeyValue,
                    },
                },
            ],
        },
        mode: 'sync',
    },
    )
    console.log('postResult', postResult)
}

export async function getAccountAddress() {
    return getAddress()
}

export async function getEarthDayBalance() {
    return getBalance(EARTHDAY);
}

export async function broadcastTransaction(toAddress: string) {
    try {
        await broadcast(toAddress, true) //Opera signature
    } catch (error) {
        console.log("error", error);          
    }
    try {
        await broadcast(toAddress, false) //@cosmjs/amino signature
    } catch (error) {
        console.log("error", error);          
    }
    return
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
