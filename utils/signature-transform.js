/* With thanks to Benzhe of Opera! */
const {Base64} = require("js-base64");

function transformSignature(signatureOperaBase64) {
    const rawArray = Base64.toUint8Array(signatureOperaBase64)
    console.log("rawSignature", rawArray)

    if (rawArray.length < 64 || rawArray.length > 66) {
        console.log("invalid length")
        return
    }

    let signatureCosmjsBase64 = ""

    if (rawArray.length == 64) {
        signatureCosmjsBase64 = signatureOperaBase64
    } else if (rawArray.length == 65) {
        if (rawArray[0] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array(rawArray.slice(1, 65))
        } else if (rawArray[32] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(0, 32), rawArray.slice(33, 65)])
        } else {
            console.log("invalid signature array, length 65")
        }
    } else if (rawArray.length == 66) {
        if (rawArray[0] == 0x00 && rawArray[33] == 0x00) {
            signatureCosmjsBase64 = Base64.fromUint8Array([rawArray.slice(1, 33), rawArray.slice(34, 66)])
        } else {
            console.log("invalid signature array, length 66")
        }
    }

    console.log("signatureCosmjsBase64", signatureCosmjsBase64)
}

const signatureOperaBase64 = "ANMcRm/X0Mhomw52NLn0cMX7osjWirw0zSiiVGnnZmIsOEcftY5XsW9pKN2kLhtAom6obUJHXN4O9Ea8Wf1Lyds="
transformSignature(signatureOperaBase64)
