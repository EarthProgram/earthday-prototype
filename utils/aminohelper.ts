import * as amino from '@cosmjs/amino'
import * as base58 from 'bs58'

let secp256k1HdWallet: amino.Secp256k1HdWallet
export let address
export let pubkeyBase64

export async function init(mnemonic, prefix) {
  secp256k1HdWallet = await amino.Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: prefix})
  const accounts = await secp256k1HdWallet.getAccounts()
  const pubkey = accounts[0].pubkey
  const pubkeyBase58 = base58.encode(pubkey)
  pubkeyBase64 = Buffer.from(pubkey).toString('base64')
  address = accounts[0].address

  console.log("aminohelper.secp256k1HdWallet", secp256k1HdWallet)
  console.log("aminohelper.account[0]", accounts[0])
  console.log("aminohelper.pubkey", pubkey)
  console.log("aminohelper.pubkeyBase58)", pubkeyBase58)
  console.log("aminohelper.pubkeyBase64)", pubkeyBase64)
  console.log("aminohelper.address", address)
}

export async function sign(stdSignDoc: amino.StdSignDoc) {
    try {
      const { signed, signature } = 
        await secp256k1HdWallet.signAmino(address, stdSignDoc)

      console.log("aminohelper.signed", signed)
      console.log("aminohelper.signature", signature)

    return { signed, signature}
  } catch (error) {
    console.log("aminohelper.error", error)
    return error
  }
}