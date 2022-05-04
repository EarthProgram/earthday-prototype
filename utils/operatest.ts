import { Secp256k1HdWallet } from '@cosmjs/amino'
import * as base58 from 'bs58'

const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"

let secp256k1HdWallet
let pubKey
let pubkeyBase58
let address

export async function initAminoHelper() {
  await init()
}

async function init() {
  secp256k1HdWallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: 'ixo'} )
  const accounts = await secp256k1HdWallet.getAccounts()
  pubKey = accounts[0].pubkey
  pubkeyBase58 = base58.encode(pubKey)
  address = accounts[0].address

  console.log("operatest.account[0]", accounts[0])
  console.log("operatest.accounts[0].pubKey", pubKey)
  console.log("operatest.base58.encode(accounts[0].pubkey)", pubkeyBase58)
  console.log("operatest.accounts[0].address", address)
}

export async function getAminoPubKey() {
  if (pubKey) return pubKey
  init()
  return pubKey
}

export async function getAminoPubKeyBase58() {
  if (pubkeyBase58) return pubkeyBase58
  init()
  return pubkeyBase58
}

export async function getAminoAddress() {
  if (address) return address
  await init()
  return address
}

export async function signPayloadWithCosmJSAmino(payload) {
  console.log("in operatest.signPayloadWithCosmJSAmino - payload: ", payload)
  try {
    const accounts = await secp256k1HdWallet.getAccounts()

    console.log("secp256k1HdWallet",secp256k1HdWallet)
    console.log("accounts[0]",accounts[0])
    console.log("accounts[0].address",accounts[0].address)

    const { signed, signature } = await secp256k1HdWallet.signAmino(accounts[0].address, payload);

    console.log("operatest.signed", signed)
    console.log("operatest.signature", signature)

    return signature;
  } catch (error) {
    console.log("error", error)
    return error
  }
}