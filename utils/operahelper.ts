import * as base58 from 'bs58'
const { Base64 } = require('js-base64')
import * as amino from "@cosmjs/amino"
import * as ixohelper from './ixohelper'
const {sha256} =  require("@cosmjs/crypto");
import * as encoding from "@cosmjs/encoding";

let didDoc
let didDocJSON
let pubKeyType: string
let signMethod: string

export const pubKeyTypeSECP256k1Opera = "EcdsaSecp256k1VerificationKey2019"
const signMethodSECP256k1Opera = "secp256k1"
export const pubKeyTypeED25519Opera = "Ed25519VerificationKey2018"
const signMethodED25519Opera = "ed25519"
const addressIndex = 0

export function setSignMethodSECP256k1() {
    pubKeyType = pubKeyTypeSECP256k1Opera
    signMethod = signMethodSECP256k1Opera
}

export function setSignMethodED25519() {
    pubKeyType = pubKeyTypeED25519Opera
    signMethod = signMethodED25519Opera
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

function getVerificationMethodSECP256k1() {
    const verificationMethod = getDIDDocJSON().verificationMethod.find(x => x.type == pubKeyTypeSECP256k1Opera)
    console.log("verificationMethodSECP256k1", verificationMethod)
    return verificationMethod
}

function getVerificationMethodED25519() {
    const verificationMethod = getDIDDocJSON().verificationMethod.find(x => x.type == pubKeyTypeED25519Opera)
    console.log("verificationMethodED25519", verificationMethod)
    return verificationMethod
}

export function getOperaPubKeyBase58(pubKeyType_: string) {
    const pubkeyBase58:string = 
        (pubKeyType_ == pubKeyTypeSECP256k1Opera 
        ? getVerificationMethodSECP256k1() 
        : getVerificationMethodED25519())
        .publicKeyBase58
    console.log("pubkeyBase58", pubkeyBase58)
    return pubkeyBase58
}

function getOperaPubKeyUint8Array(pubKeyType_: string) {
    const pubkeyUint8Array = base58.decode(getOperaPubKeyBase58(pubKeyType_))
    console.log("pubKeyUint8Array", pubkeyUint8Array)
    return pubkeyUint8Array
}

export async function getOperaPubKeyBase64(pubKeyType_: string) {
    const pubkeyBase64 = Base64.fromUint8Array(getOperaPubKeyUint8Array(pubKeyType_))
    console.log("pubkeyBase64)", pubkeyBase64)
    return pubkeyBase64
}

function encodeSecp256k1PubkeyLocal() {
    const pubkey = amino.encodeSecp256k1Pubkey(getOperaPubKeyUint8Array(pubKeyTypeSECP256k1Opera))
    console.log("pubKey", pubkey)
    return pubkey
}

async function getAddress() {
    let address: string
    console.log("operahelper.signMethod ===", signMethod)
    
    if (signMethod === signMethodSECP256k1Opera) {
        address = amino.pubkeyToAddress(encodeSecp256k1PubkeyLocal(), ixohelper.prefix) 
        console.log("operahelper.signMethodSECP256k1Opera.address ===", signMethod)
        return address
    } else if (signMethod === signMethodED25519Opera) {
        address = encoding.toBech32(ixohelper.prefix, sha256(base58.decode(getOperaPubKeyBase58(pubKeyTypeED25519Opera))).slice(0, 20))
        console.log("operahelper.signMethodED25519Opera.signMethod ===", signMethod)
        return address
    } else {
        return null
    }
}

/* With thanks to Benzhe of Opera! */
function transformSignature(signatureOpera) {

    let rawArray
    if (signMethod === signMethodED25519Opera) {
        rawArray = encoding.fromHex(signatureOpera)
        signatureOpera = encoding.toBase64(rawArray)
        console.log("signatureOpera = encoding.toBase64(rawArray)", signatureOpera)
    } else if (signMethod === signMethodSECP256k1Opera) {
        rawArray = Base64.toUint8Array(signatureOpera)
    } else {
        return null
    }
    console.log("operahelper.rawArray", rawArray)

    if (rawArray.length < 64 || rawArray.length > 66) {
        console.log("operahelper.invalid length")
        return
    }

    let signatureCosmjsBase64 = ""

    if (rawArray.length == 64) {
        signatureCosmjsBase64 = signatureOpera
    } else if (rawArray.length == 65) {
        if (rawArray[0] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array(rawArray.slice(1, 65))
        } else if (rawArray[32] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(0, 32), rawArray.slice(33, 65)])
        } else {
            console.log("operahelper.invalid signature array, length 65")
        }
    } else if (rawArray.length == 66) {
        if (rawArray[0] == 0x00 && rawArray[33] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(1, 33), rawArray.slice(34, 66)])
        } else {
            console.log("operahelper.invalid signature array, length 66")
        }
    }
    console.log("operahelper.signatureCosmjsBase64", signatureCosmjsBase64)
    return signatureCosmjsBase64
}

async function signOpera(toAddress: string, messageType: string) {
    const stdSignDoc = await ixohelper.getStdSignDoc(toAddress, await getAddress(), messageType)
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
    const messageType = ixohelper.messageTypeMsgSend
    return await signOpera(toAddress, messageType)
}

export async function signOperaED25519(toAddress: string) {
    const messageType = ixohelper.messageTypeMsgBuy
    return await signOpera(toAddress, messageType)
}