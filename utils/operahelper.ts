import * as amino from '@cosmjs/amino'
import * as crypto from '@cosmjs/crypto'

let didDocJSON

const path = "m/44'/118'/0'/0'/0'"

export function getDIDDocJSON() {
    const didDoc = window.interchain.getDidDoc(0)
    didDocJSON = JSON.parse(didDoc ?? "{}")
    return didDocJSON
}

export async function sign(stdSignDoc: amino.StdSignDoc, signMethod, addressIndex) {
    const sha256msg = crypto.sha256(amino.serializeSignDoc(stdSignDoc))
    const hexValue = Buffer.from(sha256msg).toString("hex")
    const signature = await window.interchain.signMessage(hexValue, signMethod, addressIndex)
    return signature
}