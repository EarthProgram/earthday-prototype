import * as crypto from '@cosmjs/crypto'
import * as encoding from '@cosmjs/encoding'
import * as amino from '@cosmjs/amino'
import * as base58 from 'bs58'
import * as sovrin from 'sovrin-did'

const path = "m/44'/118'/0'/0'/0'"

let didDoc
export let address
export let pubkeyBase64

export async function init(mnemonic, prefix) {
    didDoc = sovrin.fromSeed(crypto.sha256(encoding.toUtf8(mnemonic)).slice(0, 32))
    address = encoding.toBech32(prefix, crypto.sha256(base58.decode(didDoc.verifyKey)).slice(0, 20))
    pubkeyBase64 = base58.decode(didDoc.verifyKey).toString('base64')

    console.log("sovrinhelper.didDoc",didDoc)
    console.log("sovrinhelper.address",address)
    console.log("sovrinhelper.pubkeyBase64",pubkeyBase64)
}

export async function sign(stdSignDoc: amino.StdSignDoc) {
    try {
        const signatureAsByteArray = 
            sovrin.signMessage(amino.serializeSignDoc(stdSignDoc), didDoc.secret.signKey, didDoc.verifyKey)
        console.log("sovrinhelper.signatureAsByteArray",signatureAsByteArray)
        const signatureAsBase64 = encoding.toBase64(signatureAsByteArray.slice(0, 64))
        console.log("sovrinhelper.signatureAsBase64",signatureAsBase64)
    
    return { signed: stdSignDoc, signature: signatureAsBase64}
  } catch (error) {
    console.log("sovrinhelper.error", error)
    return error
  }
}