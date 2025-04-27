import { sha256 } from '@noble/hashes/sha256';
import { sign, utils } from '@noble/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import * as secp from '@noble/secp256k1';

console.log('✅ SECP VERSION:', utils.version ?? 'unknown');

function formatAmount(amount) {
  return Number(amount).toFixed(8);
}

function generateTransactionHash(from, to, amount, timeStamp, nonce, gasFee) {
  const formattedAmount = formatAmount(amount);
  const data = `${from}${to}${formattedAmount}${timeStamp}${nonce}${gasFee}`;
  const hash = sha256(new TextEncoder().encode(data));
  return bytesToHex(hash);
}

export async function signTransaction(txData, privateKeyHex, nonce) {
  const timeStamp = Date.now();

  const tx = {
    from: txData.from,
    to: txData.to,
    amount: Number(txData.amount),
    gasFee: Number(txData.gasFee),
    nonce,
    publicKeyHex: txData.publicKeyHex,
    timeStamp,
    type: txData.type,   
    meta: txData.meta || null
  };

  const txHash = generateTransactionHash(
    tx.from,
    tx.to,
    tx.amount,
    tx.timeStamp,
    tx.nonce,
    tx.gasFee
  );

  console.log(txHash);
  tx.txHash = txHash;

  const hashBytes = hexToBytes(txHash);
  const privKeyBytes = utils.hexToBytes(privateKeyHex); // ✅ fix is here!

  const [signatureCompact, recovery] = await sign(hashBytes, privKeyBytes, {
    recovered: true,
    der: false
  });

  const r = signatureCompact.slice(0, 32);
  const s = signatureCompact.slice(32, 64);
  const v = recovery + 27;

  tx.signature = `${bytesToHex(r)}${bytesToHex(s)}${v.toString(16).padStart(2, '0')}`;

  return {
    txHash,
    signedTx: tx
  };
}

// 🔓 Derive public key from private (uncompressed)
export function getPublicKeyFromPrivate(privateKeyHex) {
  return utils.bytesToHex(
    secp.getPublicKey(utils.hexToBytes(privateKeyHex), false) // false = uncompressed (starts with 04)
  );
}

// ✍️ Sign generic message (SHA256-based, like for labels)
export async function signSHA256Message(privateKeyHex, message) {
  const messageBytes = new TextEncoder().encode(message);
  const messageHash = sha256(messageBytes);
  const privKeyBytes = utils.hexToBytes(privateKeyHex);

  const [sig, rec] = await sign(messageHash, privKeyBytes, {
    recovered: true,
    der: false
  });

  const r = sig.slice(0, 32);
  const s = sig.slice(32, 64);
  const v = rec + 27;

  return `${bytesToHex(r)}${bytesToHex(s)}${v.toString(16).padStart(2, '0')}`;
}




