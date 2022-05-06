import { Secp256k1HdWallet } from '@cosmjs/amino'
import * as base58 from 'bs58'
const { Base64 } = require('js-base64')

const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"
const prefix = 'ixo'

let secp256k1HdWallet
let pubKey
let pubkeyBase58
let pubkeyBase64
let address

async function init() {
  secp256k1HdWallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: prefix} )
  const accounts = await secp256k1HdWallet.getAccounts()
  pubKey = accounts[0].pubkey
  pubkeyBase58 = base58.encode(pubKey)
  address = accounts[0].address

  console.log("aminohelper.account[0]", accounts[0])
  console.log("aminohelper.accounts[0].pubKey", pubKey)
  console.log("aminohelper.base58.encode(accounts[0].pubkey)", pubkeyBase58)
  console.log("aminohelper.accounts[0].address", address)
}

export async function getAminoPubKey() {
  if (pubKey) return pubKey
  await init()
  return pubKey
}

export async function getAminoPubKeyBase58() {
  if (pubkeyBase58) return pubkeyBase58
  await init()
  return pubkeyBase58
}

export async function getAminoPubKeyBase64() {
    if (pubkeyBase64) return pubkeyBase64
    await init()
    pubkeyBase64 = Base64.fromUint8Array(Uint8Array.from(pubKey))
    console.log("aminohelper.Base64.fromUint8Array)", pubkeyBase64)
    return pubkeyBase64
  }
  
export async function getAminoAddress() {
  if (address) return address
  await init()
  return address
}

export async function signPayloadWithAmino(payload) {
    console.log("aminohelper.signPayloadWithAmino")
    try {
    const accounts = await secp256k1HdWallet.getAccounts()

    console.log("secp256k1HdWallet",secp256k1HdWallet)
    console.log("accounts[0]",accounts[0])
    console.log("accounts[0].address",accounts[0].address)

    const { signed, signature } = await secp256k1HdWallet.signAmino(accounts[0].address, payload);

    console.log("aminohelper.signed", signed)
    console.log("aminohelper.signature", signature)

    return signature.signature;
  } catch (error) {
    console.log("error", error)
    return error
  }
}