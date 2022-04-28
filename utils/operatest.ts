const base58 = require('bs58')
const nemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"

const { Secp256k1HdWallet } = require('@cosmjs/amino')
const derivateSecp256k1PubKey = async function () {
  const secp256k1 = await Secp256k1HdWallet.fromMnemonic(nemonic, {prefix: 'ixo'} )
  const accounts = await secp256k1.getAccounts()
  console.log("operatest.account[0]", accounts[0])
  console.log("operatest.accounts[0].pubKey", accounts[0].pubKey)
  console.log("operatest.accounts[0].address", accounts[0].address)
  const pubkeyBase58 = base58.encode(accounts[0].pubkey)
  console.log("operatest.pubkeyBase58", pubkeyBase58)
  
  const { a } = require('@cosmjs/amino')
  const publickeyToaddress = async function (pubKey:String) {
    console.log("in publicKeyToAddress")
    const address = await a.pubkeyToaddress(pubKey, {prefix: 'ixo'})
    console.log("operatest.publicKeyToAddress.address", address)
  }
  publickeyToaddress(pubkeyBase58)
}
derivateSecp256k1PubKey()


export async function main() {
    console.log("in main() of client.ts")
}
