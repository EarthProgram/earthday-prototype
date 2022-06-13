const { Base64 } = require('js-base64')
import * as amino from '@cosmjs/amino'
import * as crypto from '@cosmjs/crypto'

let didDocJSON

const path = "m/44'/118'/0'/0'/0'"

export function getDIDDocJSON() {
    const didDoc = window.interchain.getDidDoc(0)
    didDocJSON = JSON.parse(didDoc ?? "{}")
    console.log("didDocJSON", didDocJSON)
    return didDocJSON
}

/* With thanks to Benzhe of Opera! 
    Only for SECP256k1
*/
export function transformSignature(signature) {
    const rawArray = Base64.toUint8Array(signature)

    if (rawArray.length < 64 || rawArray.length > 66) {
        console.log("operahelper.invalid length")
        return
    }

    let signatureCosmjsBase64 = ""

    if (rawArray.length == 64) {
        signatureCosmjsBase64 = signature
    } else if (rawArray.length == 65) {
        if (rawArray[0] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array(rawArray.slice(1, 65))
        } else if (rawArray[32] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(0, 32), rawArray.slice(33, 65)])
        } else {
            console.log("operahelper.invalid signature array, length 65")
        }
    } else if (rawArray.length == 66) {
        if (rawArray[0] == 0x00 && rawArray[33] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(1, 33), rawArray.slice(34, 66)])
        } else {
            console.log("operahelper.invalid signature array, length 66")
        }
    }
    console.log("operahelper.signatureCosmjsBase64", signatureCosmjsBase64)
    return signatureCosmjsBase64
}

export async function sign(stdSignDoc: amino.StdSignDoc, signMethod, addressIndex) {
    const sha256msg = crypto.sha256(amino.serializeSignDoc(stdSignDoc))
    const hexValue = Buffer.from(sha256msg).toString("hex")
    const signature = await window.interchain.signMessage(hexValue, signMethod, addressIndex)
    return signature
}