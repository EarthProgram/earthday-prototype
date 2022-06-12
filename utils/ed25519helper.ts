// import * as bip39 from "bip39";
import * as crypto from '@cosmjs/crypto'
import * as encoding from '@cosmjs/encoding'
import * as amino from '@cosmjs/amino'
import * as base58 from 'bs58'
// import * as base64 from 'js-base64'
// import * as ed25519 from "ed25519-hd-key";
import * as ixohelper from './ixohelper'
import * as sovrin from 'sovrin-did'

const path = "m/44'/118'/0'/0'/0'"
const mnemonic = ixohelper.mnemonic_opera

// let ed25519Keypair: crypto.Ed25519Keypair
let didDoc: any
let address: string

/** Attempt at using @cosmjs/crypto but without success */
// async function getED25519Keypair() {
//     if (ed25519Keypair) return ed25519Keypair

//     const seed = bip39.mnemonicToSeedSync(mnemonic)
//     console.log("ed25519helper.seed",seed)
//     const derivedSeed = ed25519.derivePath(path, seed.toString("hex")).key;
//     console.log("ed25519helper.derivedSeed",derivedSeed)
//     ed25519Keypair = await crypto.Ed25519.makeKeypair((derivedSeed).slice(0, 32))
//     console.log("ed25519helper.ed25519Keypair",ed25519Keypair)
//     return ed25519Keypair
// }

function getDidDoc() {
    if (didDoc) return didDoc
    didDoc = sovrin.fromSeed(crypto.sha256(encoding.toUtf8(mnemonic)).slice(0, 32))
    console.log("ed25519helper.didDoc",didDoc)
    return didDoc
}

function getAddress() {
    if (address) return address
    address = encoding.toBech32(ixohelper.prefix, crypto.sha256(base58.decode(getDidDoc().verifyKey)).slice(0, 20))
    console.log("ed25519helper.address",address)
    return address
}

export async function getED25519PubKeyBase64() {
    const pubkeyAsBase64 = base58.decode(getDidDoc().verifyKey).toString('base64')
    return pubkeyAsBase64
}

/* It seems like one has to use a combination of @cosmjs/amino and sovrin functions to make this work.
 *  @cosmjs/crypto with libsodium does not work.
 */
export async function signED25519(toAddress: string) {
    try {
        const stdSignDoc = await ixohelper.getStdSignDoc(toAddress, getAddress(), ixohelper.messageTypeMsgBuy)
        console.log("ed25519helper.stdSignDoc",stdSignDoc)
        // const stdSignDocAsByteArray = encoding.toUtf8(JSON.stringify(stdSignDoc))
        // console.log("ed25519helper.stdSignDocAsByteArray", stdSignDocAsByteArray)

        //********* tried many things that did not work  ********/
        // const hexValue = Buffer.from(sha256msg).toString("hex")
        // console.log("operahelper.hexValue", hexValue)
        // const messageAsString = JSON.stringify(stdSignDoc.msgs[0])
        // console.log("ed25519helper.messageAsString",messageAsString)
        // const messageAsByteArray = encoding.toUtf8(messageAsString)
        // const messageAsByteArray = amino.serializeSignDoc(stdSignDoc)
        // console.log("ed25519helper.messageAsByteArray",messageAsByteArray)
        //********* tried many things that did not work  ********/

        //********* from the ixo-client-sdk which works ********/
        // const
        //     fullSignature =
        //         sovrin.signMessage(
        //             serializeSignDoc(signDoc),
        //             didDoc.secret.signKey,
        //             didDoc.verifyKey,
        //         ),
        //     signatureBase64 =
        //         toBase64(fullSignature.slice(0, 64))
        //********* from the ixo-client-sdk which works ********/

        //********* using the @cosmjs/crypto lib which does not work ********/
        // const signatureAsByteArray = await crypto.Ed25519.createSignature(sha256msg, await getED25519Keypair())
        // console.log("ed25519helper.signatureAsByteArray",signatureAsByteArray)
        // const verifySignature = 
        //     await crypto.Ed25519.verifySignature(signatureAsByteArray, sha256msg, (await getED25519Keypair()).pubkey)
        // console.log("ed25519helper.verifySignature",verifySignature)        
        // const signatureAsHex = encoding.toHex(signatureAsByteArray)
        // console.log("ed25519helper.signatureAsHex",signatureAsHex)
        //********* using the @cosmjs/crypto lib which does not work ********/

        const signatureAsByteArray = 
            sovrin.signMessage(amino.serializeSignDoc(stdSignDoc), didDoc.secret.signKey, didDoc.verifyKey)
        console.log("ed25519helper.signatureAsByteArray",signatureAsByteArray)
        const signatureAsBase64 = encoding.toBase64(signatureAsByteArray.slice(0, 64))
        console.log("ed25519helper.signatureAsBase64",signatureAsBase64)
    
    return { signed: stdSignDoc, signature: signatureAsBase64}
  } catch (error) {
    console.log("ed25519helper.error", error)
    return error
  }
}