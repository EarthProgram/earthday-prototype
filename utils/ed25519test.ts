/* With thanks to Benzhe of Opera! */
import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import * as base58 from "bs58";
import {fromHex, toHex} from "@cosmjs/encoding";
import {Ed25519, Ed25519Keypair} from "@cosmjs/crypto";

const mnemonic = "ecology tone orange sell expect live goddess banner dash exhaust wrap market"
const path = "m/44'/118'/0'/0'/0'"
const hexMessage = "7b226b657931223a202276616c756531222c20226b657932223a20227468697320656e746972652074657874546f5369676e2063616e20626520616e7920737472696e67207265616c6c79227d"

// Use bip39/ed25519-hd-key to derive derivedSeed by mnemonic and path
const seed = bip39.mnemonicToSeedSync(mnemonic);
const derivedSeed = ed25519.derivePath(path, seed.toString("hex")).key;

// Use Ed25519/Ed25519Keypair of "@cosmjs/crypto" to do the verification
// https://github.com/cosmos/cosmjs/blob/main/packages/crypto/src/libsodium.ts
Ed25519.makeKeypair(derivedSeed).then(keypair => {
    console.log("pubkey_bs58", base58.encode(keypair.pubkey))
    Ed25519.createSignature(fromHex(hexMessage), keypair).then(signature_array => {
        // The signature_hex is same as result of interchain.signMessage(hexMessage, "ed25519", 0)
        console.log("signature_hex", toHex(signature_array))
        Ed25519.verifySignature(signature_array, fromHex(hexMessage), keypair.pubkey).then(verified => {
            console.log("verified", verified)
        })
    })
})
