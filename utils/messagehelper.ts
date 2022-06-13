import * as ixohelper from './ixohelper'

const messageTypeMsgSend = 'cosmos-sdk/MsgSend'
const messageTypeMsgBuy = 'bonds/MsgBuy'
const chainId = 'pandora-4'


export async function getMsgBuyStdSignDoc(authAddress: string, bondDID: string, buyerDID: string) {
    const msg = getMsgBuy(bondDID, buyerDID)
    return await getStdSignDoc(authAddress, msg)
}

export async function getMsgSendStdSignDoc(authAddress: string, toAddress: string ) {
    const msg = getMsgSend(authAddress, toAddress)
    return await getStdSignDoc(authAddress, msg)
}

async function getStdSignDoc(authAddress: string, msg: { type:string, value: any}) {
    const { accountNumber, sequence } = await ixohelper.getAuthAccount(authAddress)
    const memo = ""
    const stdSignDoc = {
        chain_id: chainId,
        account_number: accountNumber,
        sequence: sequence,
        fee: getFee(),
        msgs: [msg],
        memo: memo,
    }
    return stdSignDoc
}

function getMsgSend(fromAddress: string, toAddress: string) {
    const value = {
        amount: [{ amount: String(10), denom: 'uixo' }],
        from_address: fromAddress,
        to_address: toAddress,
        }
    return { type: messageTypeMsgSend, value }
}

function getMsgBuy(bondDID: string, buyerDID: string) {
    const value = {
        amount: { amount: String(22), denom: 'gtest3' },
        bond_did: bondDID,
        buyer_did: buyerDID,
        max_prices: [{ amount: String(1000), denom: "xusd" }]
        }
    return { type: messageTypeMsgBuy, value }
}

function getFee() {
    const fee = {
        amount: [{ amount: String(5000), denom: 'uixo' }],
        gas: String(200000),
    }
    return fee
}