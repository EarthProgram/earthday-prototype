import * as amino from '@cosmjs/amino'
import * as crypto from '@cosmjs/crypto'
import * as encoding from '@cosmjs/encoding'
import * as base58 from 'bs58'
import * as base64 from 'js-base64'
import * as operahelper from './operahelper'

const addressIndex = 0
const signMethod = "ed25519"
const pubKeyType = "Ed25519VerificationKey2018"

export let address
export let pubkeyBase64

export async function init(prefix) {
    const didDocJSON = operahelper.getDIDDocJSON()
    const verificationMethod = didDocJSON.verificationMethod.find(x => x.type == pubKeyType)
    const pubkeyBase58 = verificationMethod.publicKeyBase58
    const pubkeyByteArray = base58.decode(pubkeyBase58)
    pubkeyBase64 = base64.fromUint8Array(pubkeyByteArray)
    const pubkey = {
        type: amino.pubkeyType.ed25519,
        value: pubkeyBase58,
    }
    address = amino.pubkeyToAddress(pubkey, prefix)
    // address = encoding.toBech32(prefix, crypto.sha256(base58.decode(pubkeyBase58)).slice(0, 20))
    
    console.log("operaED25519helper.didDocJSON",didDocJSON)
    console.log("operaED25519helper.verificationMethod",verificationMethod)
    console.log("operaED25519helper.pubkeyBase58",pubkeyBase58)
    console.log("operaED25519helper.pubkeyByteArray",pubkeyByteArray)
    console.log("operaED25519helper.pubkeyBase64",pubkeyBase64)
    console.log("operaED25519helper.address",address)
}

export async function sign(stdSignDoc: amino.StdSignDoc) {
    const signature = await operahelper.sign(stdSignDoc, signMethod, addressIndex)
    return { signed: stdSignDoc, signature: signature}
}