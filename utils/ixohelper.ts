import Axios from 'axios'
import * as amino from "@cosmjs/amino"

export const mnemonic_ECO = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"
export const mnemonic_CYC = "basket mechanic myself capable shoe then home magic cream edge seminar artefact"
export const EARTHDAY = 'earthday'
export const prefix = 'ixo'
export const bondDID = 'did:ixo:Xby8Ksyct1RnayXtNuakWG'//'did:ixo:PK5dTV9hjoESxiqDKhHAGE'
export const buyerDID_CYC = 'did:ixo:CYCc2xaJKrp8Yt947Nc6jd'
export const buyerDID_ECO = 'did:ixo:8Du8pSuGie7o4kVWndManQ'

export async function getEarthDayBalance(address: string) {
    return getBalance(address, EARTHDAY);
}

async function getBalance(address: string, denom) {
    const fetchResult = await fetch(`https://testnet.ixo.world/cosmos/bank/v1beta1/balances/${address}/${denom}`)
    const balanceJSON = await fetchResult.json()
    console.log("balanceJSON", balanceJSON)
    return balanceJSON.balance.amount
}

export async function getAuthAccount(address: string) {
    let fetchResult, authAccountsJSON
    try {
        fetchResult = await fetch(`https://testnet.ixo.world/cosmos/auth/v1beta1/accounts/${address}`)
    } catch (error) {
        console.log("ixohelper.getAuthAccountsJSON.fetchResult.error", error)
    }
    authAccountsJSON = await fetchResult.json()
    console.log("ixohelper.authAccountsJSON", authAccountsJSON)
return { accountNumber: authAccountsJSON.account.account_number, sequence: authAccountsJSON.account.sequence };
}

async function postTransaction(signed, pubkey, signature) {
    return await Axios.post(`https://testnet.ixo.world/rest/txs`, {
            mode: 'sync',
            tx: {
                fee: signed.fee,
                msg: signed.msgs,
                signatures: [
                    {
                        account_number: signed.account_number,
                        pub_key: pubkey,
                        sequence: signed.sequence,
                        signature: signature,
                    },
                ],
            },
        }
    )
}

async function getPostParams(pubkeyType:string, signatureValue, localPubKeyValue: string) {
    let pubkey
    let signature

    if (!signatureValue.pub_key) {
        pubkey = {
                type: pubkeyType,
                value: localPubKeyValue
        }
    } else pubkey = signatureValue.pub_key
    console.log("ixohelper.pubkey", pubkey)

    if (!signatureValue.signature) {signature = signatureValue} else {signature = signatureValue.signature}
    console.log("ixohelper.signature", signature)
    return { pubkey, signature }
}

export async function postTransactionSECP(signed, signatureValue, localPubKeyValue: string) {
    const { pubkey, signature } = await getPostParams(amino.pubkeyType.secp256k1, signatureValue, localPubKeyValue)
    return await postTransaction(signed, pubkey, signature)
}

export async function postTransactionED(signed, signatureValue, localPubKeyValue: string) {
    const { pubkey, signature } = await getPostParams(amino.pubkeyType.ed25519, signatureValue, localPubKeyValue)
    return await postTransaction(signed, pubkey, signature)
 }