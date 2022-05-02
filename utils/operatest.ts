const base58 = require('bs58')
const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"

const { Secp256k1HdWallet } = require('@cosmjs/amino')
const { encodeSecp256k1Pubkey } = require('@cosmjs/amino')
const { pubkeyToAddress } = require('@cosmjs/amino')
const { makeSignDoc } = require('@cosmjs/amino')

const derivateSecp256k1PubKey = async function () {
  const secp256k1HdWallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: 'ixo'} )
  const accounts = await secp256k1HdWallet.getAccounts()
  console.log("operatest.account[0]", accounts[0])
  console.log("operatest.accounts[0].pubKey", accounts[0].pubKey)
  console.log("operatest.accounts[0].address", accounts[0].address)
  const pubkeyBase58 = base58.encode(accounts[0].pubkey)
  console.log("operatest.pubkeyBase58", pubkeyBase58)

  const pubKeyUint8Array = base58.decode(pubkeyBase58)
  console.log("operatest.pubKeyUint8Array", pubKeyUint8Array)
  const secp256k1PubKey = encodeSecp256k1Pubkey(pubKeyUint8Array)
  console.log("operatest.secp256k1PubKey", secp256k1PubKey)
  const addressFromCosmJSAmino = pubkeyToAddress(secp256k1PubKey, 'ixo')
  console.log("operatest.addressFromCosmJSAmino", addressFromCosmJSAmino)

  const chainId = "pandora-4";
  const msg: AminoMsg = {
    type: "cosmos-sdk/MsgSend",
    value: {
      from_address: accounts[0].address,
      to_address: 'ixo1wfvqcamfzqq6y0j75r3n9ascj3tuvup3jqtnwc',
      amount: [{ amount: "1", denom: "earthday" }],
    },
  };
  const fee = {
    amount: [{ amount: "5000", denom: "uixo" }],
    gas: "200000",
  };
  const memo = "";
  const accountNumber = 4675;
  const sequence = 0;

  const stdSignDoc = makeSignDoc([msg], fee, chainId, memo, accountNumber, sequence);
  console.log("operatest.stdSignDoc", stdSignDoc);

  const { signed, signature } = await secp256k1HdWallet.signAmino(accounts[0].address, stdSignDoc);
  console.log("operatest.signed", signed);
  console.log("operatest.signature", signature);
}

derivateSecp256k1PubKey()


export async function main() {
    console.log("in main() of client.ts")
}
