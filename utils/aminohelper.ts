import * as amino from '@cosmjs/amino'
import * as encoding from '@cosmjs/encoding'
import * as base58 from 'bs58'

const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"
const prefix = 'ixo'

let secp256k1HdWallet: amino.Secp256k1HdWallet
let pubkeyBase58: string
let pubkeyBase64: string
let address: string

async function init() {
  secp256k1HdWallet = await amino.Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: prefix})
  const accounts = await secp256k1HdWallet.getAccounts()
  const pubkey = accounts[0].pubkey
  pubkeyBase58 = base58.encode(pubkey)
  pubkeyBase64 = Buffer.from(pubkey).toString('base64')
  address = accounts[0].address

  console.log("aminohelper.secp256k1HdWallet", secp256k1HdWallet)
  console.log("aminohelper.account[0]", accounts[0])
  console.log("aminohelper.pubkey", pubkey)
  console.log("aminohelper.pubkeyBase58)", pubkeyBase58)
  console.log("aminohelper.pubkeyBase64)", pubkeyBase64)
  console.log("aminohelper.address", address)
}

export async function getAminoPubKeyBase58() {
  if (pubkeyBase58) return pubkeyBase58
  await init()
  return pubkeyBase58
}

export async function getAminoPubKeyBase64() {
    if (pubkeyBase64) return pubkeyBase64
    await init()
    return pubkeyBase64
  }
  
export async function getAminoAddress() {
  if (address) return address
  await init()
  return address
}

export async function signPayloadWithAmino(addressLocal, payload) {
    try {
    const { signed, signature } = await secp256k1HdWallet.signAmino(addressLocal, payload);

    console.log("aminohelper.signed", signed)
    console.log("aminohelper.signature", signature)

    return signature.signature;
  } catch (error) {
    console.log("error", error)
    return error
  }
}