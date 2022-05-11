import Axios from 'axios'
import * as amino from "@cosmjs/amino"

export const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"
export const messageType = 'cosmos-sdk/MsgSend'
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

export async function getStdSignDoc(toAddress: string, fromAddress: string) {
    const authAccountsJSON = await getAuthAccountsJSON(fromAddress)
    const accountNumber = getAccountNumber(authAccountsJSON)
    const sequence = getSequence(authAccountsJSON)
    const memo = ""
    const fee = {
        amount: [{ amount: String(5000), denom: 'uixo' }],
        gas: String(200000),
    }
    const msg = {
        type: messageType,
        value: {
            amount: [{ amount: String(10), denom: 'uixo' }],
            from_address: fromAddress,
            to_address: toAddress,
        },
    }
    return {
    msgs: [msg],
    fee: fee,
    chain_id: chainId,
    memo: memo,
    account_number: accountNumber,
    sequence: sequence,
    }
  }
  
export async function postTransaction(signed, signatureValue, localPubKeyValue: string) {
    let pubkey
    let signature

    if (!signatureValue.pub_key) {
        pubkey = {
                type: amino.pubkeyType.secp256k1,
                value: localPubKeyValue
        }
    } else pubkey = signatureValue.pub_key
    console.log("ixohelper.pubkey", pubkey)

    if (!signatureValue.signature) {signature = signatureValue} else {signature = signatureValue.signature}
    console.log("ixohelper.signature", signature)

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
