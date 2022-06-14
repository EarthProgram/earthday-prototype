import * as amino from '@cosmjs/amino'
import * as base58 from 'bs58'
const { Base64 } = require('js-base64')
import * as operahelper from './operahelper'

const addressIndex = 0
const signMethod = "secp256k1"
const pubKeyType = "EcdsaSecp256k1VerificationKey2019"

export let address
export let pubkeyBase64

export async function init(prefix: string) {
    const didDocJSON = operahelper.getDIDDocJSON()
    const verificationMethod = didDocJSON.verificationMethod.find(x => x.type == pubKeyType)
    const pubkeyBase58 = verificationMethod.publicKeyBase58
    const pubkeyByteArray = base58.decode(pubkeyBase58)
    pubkeyBase64 = Base64.fromUint8Array(pubkeyByteArray)
    address = operahelper.getAddressFromPubKey(pubkeyByteArray, prefix)

    console.log("operaSECP256k1helper.didDocJSON",didDocJSON)
    console.log("operaSECP256k1helper.verificationMethod",verificationMethod)
    console.log("operaSECP256k1helper.pubkeyBase58",pubkeyBase58)
    console.log("operaSECP256k1helper.pubkeyByteArray",pubkeyByteArray)
    console.log("operaSECP256k1helper.pubkeyBase64",pubkeyBase64)
    console.log("operaSECP256k1helper.address",address)

}

export async function sign(stdSignDoc: amino.StdSignDoc) {
    let signature = await operahelper.sign(stdSignDoc, signMethod, addressIndex)
    signature = transformSignature(signature)
    return { signed: stdSignDoc, signature: signature}
}

/* With thanks to Benzhe of Opera! 
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
