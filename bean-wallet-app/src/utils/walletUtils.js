import * as secp from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';

export async function generatePublicKey(privateKeyHex) {
  try {
    const publicKeyBytes = secp.getPublicKey(privateKeyHex, false); // false = uncompressed
    const publicKeyHex = toHex(publicKeyBytes);

    console.log("📣 Public Key:", publicKeyHex);
    return publicKeyHex;
  } catch (err) {
    console.error("generatePublicKey failed:", err);
    return null;
  }
}

export function generateAddress(publicKeyHex) {
  if (!publicKeyHex || publicKeyHex.length !== 130 || !publicKeyHex.startsWith("04")) {
    throw new Error("Invalid public key format.");
  }

  const publicKeyBytes = hexToBytes(publicKeyHex);
  const shaHash = sha256(publicKeyBytes);
  const ripemdHash = ripemd160(shaHash);
  const address = toHex(ripemdHash);

  return `BEANX:0x${address}`;
}

// Helper: hex to Uint8Array
function hexToBytes(hex) {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Helper: Uint8Array to hex
function toHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
