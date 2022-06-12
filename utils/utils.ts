import * as ixoclient from '@ixo/client-sdk'
import * as aminohelper from "./aminohelper"
import * as operahelper from "./operahelper"
import * as ixohelper from "./ixohelper"
import * as ed25519helper from './ed25519helper'

export async function broadcastTransaction(toAddress: string) {
    const wallet = await ixoclient.makeWallet(ixohelper.mnemonic_opera)
    console.log("ixo-client-sdk.wallet", wallet)
    const client = await ixoclient.makeClient(wallet)
    console.log("ixo-client-sdk.client", client)
    const agentAccounts = await wallet.agent.getAccounts()
    console.log("utils.wallet.agentAccounts[0].address", agentAccounts[0].address)

    try {
        // console.log(" -------- ixo-client-sdk - MsgSend SECP256k1 --------")
        // const sendTokensResult = await client.sendTokens(toAddress, 10)
        // console.log("ixo-client-sdk.sendTokensResult", sendTokensResult)
    } catch (error) {
        console.log("utils.error - ixo-client-sdk - MsgSend SECP256k1 --------", error)
    }

    try {
        // console.log(" -------- cosmjs/amino - MsgSend SECP256k1 --------")
        // const publicKeyLocal = await aminohelper.getAminoPubKeyBase64()
        // const { signed, signature } = await aminohelper.signAmino(toAddress)
        // const postResult = await ixohelper.postTransactionSECP(signed, signature , publicKeyLocal)
        // console.log("cosmjs/amino.postResult", postResult)
    } catch (error) {
        console.log("utils.error - cosmjs/amino - MsgSend SECP256k1 ", error)
    }

    try {
        // console.log(" -------- Opera - MsgSend SECP256k1 --------")
        // const publicKeyLocal = await operahelper.getOperaPubKeyBase64(operahelper.pubKeyTypeSECP256k1Opera)
        // const { signed, signatureValue } = await operahelper.signOperaSECP256k1(toAddress)
        // const postResult = await ixohelper.postTransactionSECP(signed, signatureValue , publicKeyLocal)
        // console.log("opera.postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - MsgSend SECP256k1 ", error)
    }

    try {
        // console.log(" -------- ixo-client-sdk - MsgBuy ED25519 --------")
        // const message = ixohelper.createMessage(ixohelper.messageTypeMsgBuy,'','')
        // console.log("utils.message", message)
        // const bondDid = message.value.bond_did
        // const bondToken = message.value.amount.denom
        // const reserveToken = message.value.max_prices[0].denom
        // const amount = message.value.amount.amount
        // const maxPrice = message.value.max_prices[0].amount
        // const msgBuy = await client.bonds.buy({bondDid, bondToken, reserveToken, amount, maxPrice})
        // console.log("ixo-client-sdk.msgBuy", msgBuy)
    } catch (error) {
        console.log("utils.error - ixo-client-sdk - MsgBuy ED25519 --------", error)
    }

    try {
        // console.log(" -------- cosmjs/crypto-sovrin - MsgBuy ED25519 --------")
        // const publicKeyLocal = await ed25519helper.getED25519PubKeyBase64()
        // const { signed, signature } = await ed25519helper.signED25519(toAddress)
        // const postResult = await ixohelper.postTransactionED(signed, signature , publicKeyLocal)
        // console.log("cosmjs/crypto-sovrin.postResult", postResult)
    } catch (error) {
        console.log("utils.error - cosmjs/crypto-sovrin - MsgBuy ED25519", error)
    }

    try {
        console.log(" -------- Opera - MsgBuy ED25519 --------")
        operahelper.setSignMethodED25519()
        const publicKeyLocal = await operahelper.getOperaPubKeyBase64(operahelper.pubKeyTypeED25519Opera)
        const { signed, signatureValue } = await operahelper.signOperaED25519(toAddress)
        const postResult = await ixohelper.postTransactionED(signed, signatureValue , publicKeyLocal)
        console.log("opera.postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - MsgBuy ED25519", error)
    }
}

export async function getAccountAddress() { return ""}
export async function getEarthDayBalance() {return 0}