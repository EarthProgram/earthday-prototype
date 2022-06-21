import * as ixoclient from '@ixo/client-sdk'
import * as aminohelper from "./aminohelper"
import * as operahelper from "./operahelper"
import * as ixohelper from "./ixohelper"
import * as sovrinhelper from './sovrinhelper'
import * as messagehelper from './messagehelper'
import * as operasecp256k1helper from './operasecp256k1helper'
import * as operaed25519helper from './operaed25519helper'
import * as b64 from 'js-base64'
import * as ed25519tweetnacltest from './ed25519-tweetnacl-test'
import * as amino from '@cosmjs/amino'
import * as base58 from 'bs58'
import * as base64 from 'js-base64'

export async function broadcastTransaction(toAddress: string) {

    //Opera DID returns this publicKey for ecology wallet:
    //"publicKeyBase58": "3ZczBcavdqQT7b7y1tUe6ov7nLJgpcbU8ZxDG6ScFxK5"
    // const pubkeyBase58_opera = "3ZczBcavdqQT7b7y1tUe6ov7nLJgpcbU8ZxDG6ScFxK5"
    // console.log("pubkeyBase58_opera", pubkeyBase58_opera)
    // let pubkeyByteArray = base58.decode(pubkeyBase58_opera)
    // console.log("pubkeyByteArray", pubkeyByteArray)
    // let pubkeyBase64 = base64.fromUint8Array(pubkeyByteArray)
    // console.log("pubkeyBase64", pubkeyBase64)
    // let pubkey = {
    //     type: amino.pubkeyType.ed25519,
    //     value: pubkeyBase64,
    // }
    // console.log("pubkey", pubkey)
    // let address = amino.pubkeyToAddress(pubkey, ixohelper.prefix)
    // console.log("address", address)
    // try {
    //     console.log("getAuthAccount", await ixohelper.getAuthAccount(address))
    // } catch (error) {
    //     console.log("error", error)
    // }
//--------------------------------------------------------------------------------------------------
    //ixo returns this publicKey:
    //"4wKDie3XxdUzA9nsr2j8WBFqEfgJsPCewvyd1LWWXsss"
    // const pubkeyBase58_ixo = "4wKDie3XxdUzA9nsr2j8WBFqEfgJsPCewvyd1LWWXsss"
    // console.log("pubkeyBase58_ixo", pubkeyBase58_ixo)
    // pubkeyByteArray = base58.decode(pubkeyBase58_ixo)
    // console.log("pubkeyByteArray", pubkeyByteArray)
    // pubkeyBase64 = base64.fromUint8Array(pubkeyByteArray)
    // console.log("pubkeyBase64", pubkeyBase64)
    // pubkey = {
    //     type: amino.pubkeyType.ed25519,
    //     value: pubkeyBase64,
    // }
    // console.log("pubkey", pubkey)
    // address = amino.pubkeyToAddress(pubkey, ixohelper.prefix)
    // console.log("address", address)
    // try {
    //     console.log("getAuthAccount", await ixohelper.getAuthAccount(address))
    // } catch (error) {
    //     console.log("error", error)
    // }

/**************************** ixo-client-sdk ****************************/
    // const wallet = await ixoclient.makeWallet(ixohelper.mnemonic_opera)
    // console.log("ixo-client-sdk.wallet", wallet)
    // const client = await ixoclient.makeClient(wallet)
    // console.log("ixo-client-sdk.client", client)
    // const agentAccounts = await wallet.agent.getAccounts()
    // console.log("utils.wallet.agentAccounts[0].address", agentAccounts[0].address)
    try {
        // console.log(" -------- ixo-client-sdk - MsgSend SECP256k1 --------")
        // const sendTokensResult = await client.sendTokens(toAddress, 10)
        // console.log("ixo-client-sdk.sendTokensResult", sendTokensResult)
    } catch (error) {
        console.log("utils.error - ixo-client-sdk - MsgSend SECP256k1 --------", error)
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
/**************************** libraries (@cosmjs/amino + sovrin) ****************************/
    try {
        console.log(" -------- cosmjs/amino - MsgSend SECP256k1 --------")
        await aminohelper.init(ixohelper.mnemonic_CYC, ixohelper.prefix)
        const { signed, signature } = await aminohelper.sign(
            await messagehelper.getMsgSendStdSignDoc(aminohelper.address, toAddress))
        const postResult = await ixohelper.postTransactionSECP(signed, signature, aminohelper.pubkeyBase64)
        console.log("cosmjs/amino.postResult", postResult)
    } catch (error) {
        console.log("utils.error - cosmjs/amino - MsgSend SECP256k1 ", error)
    }

    try {
        console.log(" -------- cosmjs/amino - MsgBuy SECP256k1 --------")
        await aminohelper.init(ixohelper.mnemonic_CYC, ixohelper.prefix)
        const { signed, signature } = await aminohelper.sign(
            await messagehelper.getMsgBuyStdSignDoc(aminohelper.address, ixohelper.bondDID, ixohelper.buyerDID_CYC))
        const postResult = await ixohelper.postTransactionSECP(signed, signature, aminohelper.pubkeyBase64)
        console.log("cosmjs/amino.postResult", postResult)
    } catch (error) {
        console.log("utils.error - cosmjs/amino - MsgSend SECP256k1 ", error)
    }

    try {
        console.log(" -------- sovrin - MsgBuy ED25519 --------")
        await sovrinhelper.init(ixohelper.mnemonic_CYC, ixohelper.prefix)
        const { signed, signature } = await sovrinhelper.sign(
            await messagehelper.getMsgBuyStdSignDoc(sovrinhelper.address, ixohelper.bondDID, ixohelper.buyerDID_CYC))
        const postResult = await ixohelper.postTransactionED(signed, signature, sovrinhelper.pubkeyBase64)
        console.log("sovrin.postResult", postResult)
    } catch (error) {
        console.log("utils.error - sovrin - MsgBuy ED25519", error)
    }
/**************************** OPERA ****************************/
    try {
        // console.log(" -------- Opera - MsgSend SECP256k1 --------")
        // await operasecp256k1helper.init(ixohelper.prefix)
        // const { signed, signature } = await operasecp256k1helper.sign(
        //     await messagehelper.getMsgSendStdSignDoc(operasecp256k1helper.address, toAddress))
        // const postResult = await ixohelper.postTransactionSECP(signed, signature, operasecp256k1helper.pubkeyBase64)
        // console.log("opera.postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - MsgSend SECP256k1 ", error)
    }

    try {
        // console.log(" -------- Opera - MsgBuy ED25519 --------")
        // await operaed25519helper.init(ixohelper.prefix)
        // const { signed, signature } = await operaed25519helper.sign(
        //     await messagehelper.getMsgBuyStdSignDoc(operaed25519helper.address, ixohelper.bondDID, ixohelper.buyerDID_ECO))
        // const postResult = await ixohelper.postTransactionED(signed, signature, operaed25519helper.pubkeyBase64)
        // console.log("opera.postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - MsgBuy ED25519", error)
    }
}

export async function getAccountAddress() { return ""}
export async function getEarthDayBalance() {return 0}