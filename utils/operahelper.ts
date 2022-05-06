import * as base58 from 'bs58'
const { Base64 } = require('js-base64')
import { encodeSecp256k1Pubkey, Pubkey, pubkeyToAddress } from "@cosmjs/amino"

let didDoc
let didDocJSON
let pubkeyBase58
let pubkeyUint8Array: Buffer
let pubkey: Pubkey
let pubkeyBase64
let address 

const pubKeyTypeSECP256k1Opera = "EcdsaSecp256k1VerificationKey2019"
const signMethodSECP256k1Opera = "secp256k1"
const pubKeyTypeED25519Opera = "Ed25519VerificationKey2018"
const signMethodED25519Opera = "ed25519"
const prefix = 'ixo'
const addressIndex = 0

function getPubKeyType() {
    const localPubKeyType = pubKeyTypeED25519Opera
    console.log("localPubKeyType", localPubKeyType)
    return localPubKeyType
}

export function getSignMethod() {
    const signMethod = signMethodED25519Opera
    console.log("signMethod", signMethod)
    return signMethod
}

export function getOperaPubKeyBase58() {
    if (pubkeyBase58) return pubkeyBase58
    pubkeyBase58 = getVerificationMethod().publicKeyBase58
    console.log("pubkeyBase58", pubkeyBase58)
    return pubkeyBase58
}

export function getOperaPubKeyUint8Array() {
    if (pubkeyUint8Array) return pubkeyUint8Array
    pubkeyUint8Array = base58.decode(getOperaPubKeyBase58())
    console.log("pubKeyUint8Array", pubkeyUint8Array)
    return pubkeyUint8Array
}

export async function getOperaPubKeyBase64() {
    if (pubkeyBase64) return pubkeyBase64
    pubkeyBase64 = Base64.fromUint8Array(getOperaPubKeyUint8Array())
    console.log("aminohelper.Base64.fromUint8Array)", pubkeyBase64)
    return pubkeyBase64
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

function encodeSecp256k1PubkeyLocal() {
    if (pubkey) return pubkey
    pubkey = encodeSecp256k1Pubkey(getOperaPubKeyUint8Array())
    console.log("pubKey", pubkey)
    return pubkey
}

export function getOperaAddress() {
    if (address) return address
    address = pubkeyToAddress(encodeSecp256k1PubkeyLocal(), prefix) 
    console.log("address", address)
    return address
}

export async function signPayloadWithOpera(payload, ) {
    const signatureValue = await window.interchain.signMessage(payload, getSignMethod(), addressIndex)
    console.log("signatureValue", signatureValue)
    return signatureValue
}