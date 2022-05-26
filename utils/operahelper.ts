import * as base58 from 'bs58'
const { Base64 } = require('js-base64')
import * as amino from "@cosmjs/amino"
import * as ixohelper from './ixohelper'
const {sha256} =  require("@cosmjs/crypto");

let didDoc
let didDocJSON
let pubKeyType: string
let signMethod: string

const pubKeyTypeSECP256k1Opera = "EcdsaSecp256k1VerificationKey2019"
const signMethodSECP256k1Opera = "secp256k1"
const pubKeyTypeED25519Opera = "Ed25519VerificationKey2018"
const signMethodED25519Opera = "ed25519"
const addressIndex = 0

export function getOperaPubKeyBase58() {
    const pubkeyBase58 = getVerificationMethod().publicKeyBase58
    console.log("pubkeyBase58", pubkeyBase58)
    return pubkeyBase58
}

function getOperaPubKeyUint8Array() {
    const pubkeyUint8Array = base58.decode(getOperaPubKeyBase58())
    console.log("pubKeyUint8Array", pubkeyUint8Array)
    return pubkeyUint8Array
}

export async function getOperaPubKeyBase64() {
    const pubkeyBase64 = Base64.fromUint8Array(getOperaPubKeyUint8Array())
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
    const verificationMethod = getDIDDocJSON().verificationMethod.find(x => x.type == pubKeyType)
    console.log("verificationMethod", verificationMethod)
    return verificationMethod
}

function encodeSecp256k1PubkeyLocal() {
    const pubkey = amino.encodeSecp256k1Pubkey(getOperaPubKeyUint8Array())
    console.log("pubKey", pubkey)
    return pubkey
}

function getAddress() {
    const address = amino.pubkeyToAddress(encodeSecp256k1PubkeyLocal(), ixohelper.prefix) 
    console.log("address", address)
    return address
}

/* With thanks to Benzhe of Opera! */
function transformSignature(signatureOperaBase64) {
    
    if (signMethod === signMethodED25519Opera) return signatureOperaBase64

    const rawArray = Base64.toUint8Array(signatureOperaBase64)
    console.log("rawSignature", rawArray)

    if (rawArray.length < 64 || rawArray.length > 66) {
        console.log("invalid length")
        return
    }

    let signatureCosmjsBase64 = ""

    if (rawArray.length == 64) {
        signatureCosmjsBase64 = signatureOperaBase64
    } else if (rawArray.length == 65) {
        if (rawArray[0] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array(rawArray.slice(1, 65))
        } else if (rawArray[32] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(0, 32), rawArray.slice(33, 65)])
        } else {
            console.log("invalid signature array, length 65")
        }
    } else if (rawArray.length == 66) {
        if (rawArray[0] == 0x00 && rawArray[33] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(1, 33), rawArray.slice(34, 66)])
        } else {
            console.log("invalid signature array, length 66")
        }
    }
    console.log("signatureCosmjsBase64", signatureCosmjsBase64)
    return signatureCosmjsBase64
}

async function signOpera(toAddress: string, messageType: string) {
    const stdSignDoc = await ixohelper.getStdSignDoc(toAddress, getAddress(), messageType)
    console.log("operahelper.stdSignDoc", stdSignDoc)
    const sha256msg = sha256(amino.serializeSignDoc(stdSignDoc))
    console.log("operahelper.sha256msg", sha256msg)
    const hexValue = Buffer.from(sha256msg).toString("hex")
    console.log("operahelper.hexValue", hexValue)
    const signatureOpera = await window.interchain.signMessage(hexValue, signMethod, addressIndex)
    console.log("operahelper.signatureOpera", signatureOpera)
    const signatureValue = transformSignature(signatureOpera)
    console.log("operahelper.signatureValue", signatureValue)
    return { signed: stdSignDoc, signatureValue }
}

export async function signOperaSECP256k1(toAddress: string) {
    pubKeyType = pubKeyTypeSECP256k1Opera
    signMethod = signMethodSECP256k1Opera
    const messageType = ixohelper.messageTypeMsgSend
    return await signOpera(toAddress, messageType)
}

export async function signOperaED25519(toAddress: string) {
    pubKeyType = pubKeyTypeED25519Opera
    signMethod = signMethodED25519Opera
    const messageType = ixohelper.messageTypeMsgBuy
    return await signOpera(toAddress, messageType)
}