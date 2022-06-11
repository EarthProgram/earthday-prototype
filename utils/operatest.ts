const base58 = require('bs58')
const { Base64 } = require('js-base64')
const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"

const { Secp256k1HdWallet } = require('@cosmjs/amino')
const { encodeSecp256k1Pubkey } = require('@cosmjs/amino')
const { pubkeyToAddress } = require('@cosmjs/amino')
const { makeSignDoc, serializeSignDoc } = require('@cosmjs/amino')
const { AminoMsg } = require('@cosmjs/amino')
const {sha256} =  require("@cosmjs/crypto");
const {decodeSignature} = require('@cosmjs/amino')

const derivateSecp256k1PubKey = async function () {
  const secp256k1HdWallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: 'ixo'} )
  const accounts = await secp256k1HdWallet.getAccounts()
  console.log("operatest.account[0]", accounts[0])
  console.log("operatest.accounts[0].pubKey", accounts[0].pubKey)
  console.log("operatest.accounts[0].address", accounts[0].address)

  // raw pubkey
  const pubkeyRaw = Uint8Array.from(accounts[0].pubkey)
  console.log("operatest.pubkeyRaw", pubkeyRaw)

  // base64 encoding pubkey
  const pubkeyBase64 = Base64.fromUint8Array(pubkeyRaw)
  console.log("operatest.pubkeyBase64", pubkeyBase64)

  // base58 encoding pubkey
  const pubkeyBase58 = base58.encode(accounts[0].pubkey)
  console.log("operatest.pubkeyBase58", pubkeyBase58)

  const pubKeyUint8Array = base58.decode(pubkeyBase58)
  console.log("operatest.pubKeyUint8Array", pubKeyUint8Array)
  const secp256k1PubKey = encodeSecp256k1Pubkey(pubKeyUint8Array)
  console.log("operatest.secp256k1PubKey", secp256k1PubKey)
  const addressFromCosmJSAmino = pubkeyToAddress(secp256k1PubKey, 'ixo')
  console.log("operatest.addressFromCosmJSAmino", addressFromCosmJSAmino)

  const chainId = "pandora-4";
  const msg: typeof AminoMsg = {
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

  // HEX value of `sha256(serializeSignDoc(stdSignDoc))` is 64c025cdc504d4cc4c5ca0934ff246f0c12f7fd1aa24b1b717a951da91c0afd5
  // window.interchain.signMessage("64c025cdc504d4cc4c5ca0934ff246f0c12f7fd1aa24b1b717a951da91c0afd5", "secp256k1", 0)
  //     ==> ANMcRm/X0Mhomw52NLn0cMX7osjWirw0zSiiVGnnZmIsOEcftY5XsW9pKN2kLhtAom6obUJHXN4O9Ea8Wf1Lyds=
  const sha256msg = sha256(serializeSignDoc(stdSignDoc))
  const hexValue = Buffer.from(sha256msg).toString("hex")
  console.log("operatest.stdSignDoc.hexValue", hexValue)

  const { signed, signature } = await secp256k1HdWallet.signAmino(accounts[0].address, stdSignDoc);
  console.log("operatest.signed", signed);
  console.log("operatest.signature", signature);

  const rawSignature = decodeSignature(signature)
  console.log("operatest.rawSignature", rawSignature.signature)
}

derivateSecp256k1PubKey()


export async function main() {
    console.log("in main() of client.ts")
}
