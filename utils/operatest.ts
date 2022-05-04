import { Secp256k1HdWallet } from '@cosmjs/amino'
import * as base58 from 'bs58'

export async function signPayloadWithCosmJSAmino(payload) {
  const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"
  const secp256k1HdWallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: 'ixo'} )
  const accounts = await secp256k1HdWallet.getAccounts()
  const pubkeyBase58 = base58.encode(accounts[0].pubkey)
  const { signed, signature } = await secp256k1HdWallet.signAmino(payload.to_address, payload);

  console.log("operatest.account[0]", accounts[0])
  console.log("operatest.accounts[0].pubKey", accounts[0].pubkey)
  console.log("operatest.accounts[0].address", accounts[0].address)
  console.log("operatest.base58.encode(accounts[0].pubkey)", pubkeyBase58)
  console.log("operatest.signed", signed);
  console.log("operatest.signature", signature);

  return signature;
}