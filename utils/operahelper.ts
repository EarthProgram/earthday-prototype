import * as base58 from 'bs58'
const { Base64 } = require('js-base64')
import * as amino from "@cosmjs/amino"
import * as ixohelper from './ixohelper'
const {sha256} =  require("@cosmjs/crypto");

let didDoc
let didDocJSON
let pubkeyBase58: string
let pubkeyUint8Array: Buffer
let pubkey: amino.Pubkey
let pubkeyBase64: string
let address: string

const pubKeyTypeSECP256k1Opera = "EcdsaSecp256k1VerificationKey2019"
const signMethodSECP256k1Opera = "secp256k1"
const pubKeyTypeED25519Opera = "Ed25519VerificationKey2018"
const signMethodED25519Opera = "ed25519"
const addressIndex = 20

export function getOperaPubKeyBase58() {
    if (pubkeyBase58) return pubkeyBase58
    pubkeyBase58 = getVerificationMethod().publicKeyBase58
    console.log("pubkeyBase58", pubkeyBase58)
    return pubkeyBase58
}

function getOperaPubKeyUint8Array() {
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
    const verificationMethod = getDIDDocJSON().verificationMethod.find(x => x.type == pubKeyTypeSECP256k1Opera)
    console.log("verificationMethod", verificationMethod)
    return verificationMethod
}

function encodeSecp256k1PubkeyLocal() {
    if (pubkey) return pubkey
    pubkey = amino.encodeSecp256k1Pubkey(getOperaPubKeyUint8Array())
    console.log("pubKey", pubkey)
    return pubkey
}

function getAddress() {
    if (address) return address
    address = amino.pubkeyToAddress(encodeSecp256k1PubkeyLocal(), ixohelper.prefix) 
    console.log("address", address)
    return address
}

export async function signOpera(toAddress: string) {
    const stdSignDoc = await ixohelper.getStdSignDoc(toAddress, getAddress())
    console.log("operahelper.stdSignDoc", stdSignDoc)
    const sha256msg = sha256(amino.serializeSignDoc(stdSignDoc))
    console.log("operahelper.sha256msg", sha256msg)
    const hexValue = Buffer.from(sha256msg).toString("hex")
    console.log("operahelper.hexValue", hexValue)
    const signatureValue = await window.interchain.signMessage(sha256msg, signMethodSECP256k1Opera, addressIndex)
    console.log("operahelper.signatureValue", signatureValue)
    return { signed: stdSignDoc, signatureValue }
}
