import * as ixoclient from '@ixo/client-sdk'
import * as aminohelper from "./aminohelper"
import * as operahelper from "./operahelper"
import * as ixohelper from "./ixohelper"

export async function broadcastTransaction(toAddress: string) {

    try {
        // console.log(" -------- ixoClient sign --------")
        // const wallet = await ixoclient.makeWallet(ixohelper.mnemonic)
        // console.log("ixoClient.wallet", wallet)
        // const client = await ixoclient.makeClient(wallet)
        // console.log("ixoClient.client", client)
        // const sendTokensResult = await client.sendTokens(toAddress, 10)
        // console.log("ixoClient.sendTokensResult", sendTokensResult)
        // const msgDelegate = await ixoclient.delegate('ixo12345', 10)
        // const msgUndelegate = await ixoclient.undelegate('ixo12345', 5)
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
        // console.log(" -------- Opera sign - MsgSend Base64 pubKey - SECP256k1 --------")
        // const publicKeyLocal = await operahelper.getOperaPubKeyBase64()
        // const { signed, signatureValue } = await operahelper.signOperaSECP256k1(toAddress)
        // const postResult = await ixohelper.postTransaction(signed, signatureValue , publicKeyLocal)
        // console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - Base64", error)
    }

    try {
        //ED25519 MsgBuy for ED check - use CYC DID
        console.log(" -------- Opera sign - MsgBuy Base64 pubKey - ED25519 --------")
        operahelper.setSignMethodED25519()
        const publicKeyLocal = await operahelper.getOperaPubKeyBase64()
        const { signed, signatureValue } = await operahelper.signOperaED25519(toAddress)
        const postResult = await ixohelper.postTransactionED(signed, signatureValue , publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - Base64", error)
    }
}

export async function getAccountAddress() { return ""}
export async function getEarthDayBalance() {return 0}