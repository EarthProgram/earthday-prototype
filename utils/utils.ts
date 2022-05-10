import { makeWallet, makeClient } from '@ixo/client-sdk'
import { getAminoAddress, signPayloadWithAmino, getAminoPubKeyBase58, getAminoPubKeyBase64} from "./aminohelper"
import { getOperaAddress, signPayloadWithOpera, getOperaPubKeyBase58, getOperaPubKeyBase64 } from "./operahelper"
import { getPayload, postTransaction } from "./ixohelper"

const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"

export async function broadcastTransaction(toAddress: string) {
//ED25519 MsgBuy for ED check - use CYC DID

//Osmosis swap ATOM to   
//Cheqd - my identity   
//ixo lodge a claim   
//Gravity/Sifchain swap to USDC  
//UMEE - collateral-based loan   
//Stargaze - buy/sell NFT
//Branded Netlify interface
//dApp store with Opera - 2 months from now to raise $200K

    try {
        console.log("ixoClient sign --------")
        const wallet = await makeWallet(mnemonic)
        console.log("ixoClient.wallet", wallet)
        const client = await makeClient(wallet)
        console.log("ixoClient.client", client)
        const sendTokensResult = await client.sendTokens(toAddress, 10)
        console.log("ixoClient.sendTokensResult", sendTokensResult)
    } catch (error) {
        console.log("ixoClient sign --------", error)
    }

    try {
        console.log("Amino sign - MsgSend Base58 pubKey")
        const publicKeyLocal = await getAminoPubKeyBase64()
        const fromAddress = await getAminoAddress()
        const payload = await getPayload(toAddress, fromAddress)
        const signatureValue = await signPayloadWithAmino(fromAddress, payload)
        const postResult = await postTransaction(payload, signatureValue, publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Amino - Base58", error)
    }

    try {
        console.log("Opera sign - MsgSend Base58 pubKey")
        const publicKeyLocal = await getOperaPubKeyBase64()
        const fromAddress = await getOperaAddress()
        const payload = await getPayload(toAddress, fromAddress)
        const signatureValue = await signPayloadWithOpera(payload)
        const postResult = await postTransaction(payload, signatureValue, publicKeyLocal)
        console.log("postResult", postResult)
    } catch (error) {
        console.log("utils.error - Opera - Base58", error)
    }
}

export async function getAccountAddress() { return ""}
export async function getEarthDayBalance() {return 0}