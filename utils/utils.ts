import { makeWallet, makeClient } from '@ixo/client-sdk'
import * as aminohelper from "./aminohelper"
import * as operahelper from "./operahelper"
import * as ixohelper from "./ixohelper"

export async function broadcastTransaction(toAddress: string) {
//ED25519 MsgBuy for ED check - use CYC DID
    try {
        // console.log(" -------- ixoClient sign --------")
        // const wallet = await makeWallet(ixohelper.mnemonic)
        // console.log("ixoClient.wallet", wallet)
        // const client = await makeClient(wallet)
        // console.log("ixoClient.client", client)
        // const sendTokensResult = await client.sendTokens(toAddress, 15)
        // console.log("ixoClient.sendTokensResult", sendTokensResult)
    } catch (error) {
        console.log("ixoClient sign --------", error)
    }

    try {
        // console.log(" -------- Amino sign - MsgSend Base64 pubKey --------")
        // const publicKeyLocal = await aminohelper.getAminoPubKeyBase64()
        // const { signed, signature } = await aminohelper.signAmino(toAddress)
        // const postResult = await ixohelper.postTransaction(signed, signature , publicKeyLocal)
        // console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Amino - Base64", error)
    }

    try {
        console.log(" -------- Opera sign - MsgSend Base64 pubKey --------")
        const publicKeyLocal = await operahelper.getOperaPubKeyBase64()
        const { signed, signatureValue } = await operahelper.signOpera(toAddress)
        const postResult = await ixohelper.postTransaction(signed, signatureValue , publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - Base64", error)
    }
}

export async function getAccountAddress() { return ""}
export async function getEarthDayBalance() {return 0}