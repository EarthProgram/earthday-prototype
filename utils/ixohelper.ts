import Axios from 'axios'
import * as amino from "@cosmjs/amino"

export const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"
export const messageTypeMsgSend = 'cosmos-sdk/MsgSend'
export const messageTypeMsgBuy = 'bonds/MsgBuy'
export const chainId = 'pandora-4'
export const EARTHDAY = 'earthday'
export const prefix = 'ixo'

export async function getEarthDayBalance(address: string) {
    return getBalance(address, EARTHDAY);
}

async function getBalance(address: string, denom) {
    const fetchResult = await fetch(`https://testnet.ixo.world/cosmos/bank/v1beta1/balances/${address}/${denom}`)
    const balanceJSON = await fetchResult.json()
    console.log("balanceJSON", balanceJSON)
    return balanceJSON.balance.amount
}

export async function getAuthAccountsJSON(address: string) {
    const fetchResult = await fetch(`https://testnet.ixo.world/cosmos/auth/v1beta1/accounts/${address}`)
    const authAccountsJSON = await fetchResult.json()
    console.log("ixohelper.authAccountsJSON", authAccountsJSON)
    return authAccountsJSON;
}

export function getAccountNumber(authAccountsJSON) {
    const accountNumber = authAccountsJSON.account.account_number;
    console.log("ixohelper.accountNumber", accountNumber)
    return accountNumber
}

export function getSequence(authAccountsJSON) {
    let sequence = authAccountsJSON.account.sequence;
    if (!sequence) sequence = '0';
    console.log("ixohelper.sequence", sequence)
    return sequence
}

export async function getStdSignDoc(toAddress: string, fromAddress: string, messageType: string) {
    const authAccountsJSON = await getAuthAccountsJSON(fromAddress)
    const accountNumber = getAccountNumber(authAccountsJSON)
    const sequence = getSequence(authAccountsJSON)
    const memo = ""
    const fee = {
        amount: [{ amount: String(5000), denom: 'uixo' }],
        gas: String(200000),
    }
    const msg = createMessage(messageType, fromAddress, toAddress)

    return {
    msgs: [msg],
    fee: fee,
    chain_id: chainId,
    memo: memo,
    account_number: accountNumber,
    sequence: sequence,
    }
}

function createMessage(messageType: string, fromAddress: string, toAddress: string) {
    let value
    if (messageType === messageTypeMsgSend) {
        value = {
            amount: [{ amount: String(10), denom: 'uixo' }],
            from_address: fromAddress,
            to_address: toAddress,
        }
    } else if (messageType === messageTypeMsgBuy) {
        value = {
        buyer_did: 'did:sov:CYCc2xaJKrp8Yt947Nc6jd',
        amount: { amount: String(22), denom: 'uixo' },
        max_prices: [{ amount: String(1), denom: "xusd" }],
        bond_did: "did:ixo:75SZoisuNpsDezmYURaBb7"
        }
    } else {
        value = {
            error: "no messageType defined"
        }
    }
    return { type: messageType, value }
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

async function getPostParamsSECP(signatureValue, localPubKeyValue: string) {
    return await getPostParams(amino.pubkeyType.secp256k1, signatureValue, localPubKeyValue)
}

async function getPostParamsED(signatureValue, localPubKeyValue: string) {
    return await getPostParams(amino.pubkeyType.ed25519, signatureValue, localPubKeyValue)
}

export async function postTransaction(signed, signatureValue, localPubKeyValue: string) {
    const { pubkey, signature } = await getPostParamsSECP(signatureValue, localPubKeyValue)

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

export async function postTransactionED(signed, signatureValue, localPubKeyValue: string) {
    const { pubkey, signature } = await getPostParamsED(signatureValue, localPubKeyValue)

    return await Axios.post(`https://testnet.ixo.world/rest/txs`, {
        tx: {
            msg: signed.msgs,
            fee: signed.fee,
            signatures: [
                {
                    account_number: signed.account_number,
                    sequence: signed.sequence,
                    signature: signature,
                    pub_key: pubkey,
                },
            ],
        },
        mode: 'sync'
    }
    )
 }