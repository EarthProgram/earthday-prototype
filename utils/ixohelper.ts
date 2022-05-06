import Axios from 'axios'
import { pubkeyType } from "@cosmjs/amino"

const messageType = 'cosmos-sdk/MsgSend'
const chainId = 'pandora-4'
const EARTHDAY = 'earthday'

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
    const fetchResult = await fetch(`https://testnet.ixo.world/auth/accounts/${address}`)
    const authAccountsJSON = await fetchResult.json()
    console.log("ixohelper.authAccountsJSON", authAccountsJSON)
    return authAccountsJSON;
}

export function getAccountNumber(authAccountsJSON) {
    const accountNumber = authAccountsJSON.result.value.account_number;
    console.log("ixohelper.accountNumber", accountNumber)
    return accountNumber
}

export function getSequence(authAccountsJSON) {
    let sequence = authAccountsJSON.result.value.sequence;
    if (!sequence) sequence = '0';
    console.log("ixohelper.sequence", sequence)
    return sequence
}

export async function getPayload(toAddress: string, fromAddress: string) {
    const authAccountsJSON = await getAuthAccountsJSON(fromAddress)
    const accountNumber = getAccountNumber(authAccountsJSON)
    const sequence = getSequence(authAccountsJSON)
    const msg = {
        type: messageType,
        value: {
            amount: [{ amount: String(1), denom: 'earthday' }],
            from_address: fromAddress,
            to_address: toAddress,
        },
    }
    const fee = {
        amount: [{ amount: String(5000), denom: 'uixo' }],
        gas: String(200000),
    }
    const memo = ''
    const payload = {
        msgs: [msg],
        chainId,
        fee,
        memo,
        account_number: accountNumber,
        sequence: sequence,
    }
    console.log("ixohelper.msg", msg)
    console.log("ixohelper.fee", fee)
    console.log("ixohelper.memo", memo)
    console.log("ixohelper.payload", payload)
    return payload
}

export async function postTransaction(payload, signatureValue: string, localPubKeyValue: string) {
    return await Axios.post(`https://testnet.ixo.world/txs`, {
        tx: {
            msg: payload.msgs,
            fee: payload.fee,
            signatures: [
                {
                    account_number: payload.account_number,
                    sequence: payload.sequence,
                    signature: signatureValue,
                    pub_key: {
                        type: pubkeyType.ed25519,
                        value: localPubKeyValue,
                    },
                },
            ],
            memo: payload.memo,
            // chain_Id: payload.chainId,
        },
        mode: 'sync',
    }
    )
}
