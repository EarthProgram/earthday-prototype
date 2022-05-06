import { getAminoAddress, signPayloadWithAmino, getAminoPubKeyBase58, getAminoPubKeyBase64 } from "./aminohelper"
import { getOperaAddress, signPayloadWithOpera, getOperaPubKeyBase58, getOperaPubKeyBase64 } from "./operahelper"
import { getPayload, postTransaction } from "./ixohelper"

async function signPayload(payload, isOpera: boolean) {
    if (isOpera) return await signPayloadWithOpera(payload)
    return await signPayloadWithAmino(payload)
}

export async function broadcastTransaction(toAddress: string) {
    try {
        console.log("Amino sign - MsgSend Base58 pubKey")
        const publicKeyLocal = await getAminoPubKeyBase58()
        const fromAddress = await getAminoAddress()
        const payload = await getPayload(toAddress, fromAddress)
        const signatureValue = await signPayload(payload, false)
        const postResult = await postTransaction(payload, signatureValue, publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Amino - Base58", error)
    }

    try {
        console.log("Amino sign - MsgSend Base64 pubKey")
        const publicKeyLocal = await getAminoPubKeyBase64()
        const fromAddress = await getAminoAddress()
        const payload = await getPayload(toAddress, fromAddress)
        const signatureValue = await signPayload(payload, false)
        const postResult = await postTransaction(payload, signatureValue, publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Amino - Base64", error)
    }

    try {
        console.log("Opera sign - MsgSend Base58 pubKey")
        const publicKeyLocal = await getOperaPubKeyBase58()
        const fromAddress = await getOperaAddress()
        const payload = await getPayload(toAddress, fromAddress)
        const signatureValue = await signPayload(payload, false)
        const postResult = await postTransaction(payload, signatureValue, publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - Base58", error)
    }

    try {
        console.log("Opera sign - MsgSend Base64 pubKey")
        const publicKeyLocal = await getOperaPubKeyBase64()
        const fromAddress = await getOperaAddress()
        const payload = await getPayload(toAddress, fromAddress)
        const signatureValue = await signPayload(payload, false)
        const postResult = await postTransaction(payload, signatureValue, publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - Base64", error)
    }
}

export async function getAccountAddress() { return ""}
export async function getEarthDayBalance() {return 0}