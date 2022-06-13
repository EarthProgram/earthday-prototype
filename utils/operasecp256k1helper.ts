import * as amino from '@cosmjs/amino'
import * as base58 from 'bs58'
import * as base64 from 'js-base64'
import * as operahelper from './operahelper'

const addressIndex = 0
const signMethod = "secp256k1"
const pubKeyType = "EcdsaSecp256k1VerificationKey2019"

export let address
export let pubkeyBase64
let didDocJSON
let verificationMethod
let pubkeyBase58
let pubkeyByteArray
let secp256k1Pubkey

export async function init(prefix) {
    didDocJSON = operahelper.getDIDDocJSON()
    verificationMethod = didDocJSON.verificationMethod.find(x => x.type == pubKeyType)
    pubkeyBase58 = verificationMethod.publicKeyBase58
    pubkeyByteArray = base58.decode(pubkeyBase58)
    pubkeyBase64 = base64.fromUint8Array(pubkeyByteArray)
    secp256k1Pubkey = amino.encodeSecp256k1Pubkey(pubkeyByteArray)
    address = amino.pubkeyToAddress(secp256k1Pubkey, prefix) 
}

export async function sign(stdSignDoc: amino.StdSignDoc) {
    let signature = await operahelper.sign(stdSignDoc, signMethod, addressIndex)
    signature = operahelper.transformSignature(signature)
    return { signed: stdSignDoc, signature: signature}
}

