import { signSHA256Message, getPublicKeyFromPrivate } from './signingUtils';

export async function signLabelUpdate(privateKey, address, label) {
  const message = `SET_LABEL:${address}:${label}`;
  const publicKeyHex = getPublicKeyFromPrivate(privateKey);
  const signature = await signSHA256Message(privateKey, message);
  
  return {
    address,
    label,
    signature,
    publicKeyHex
  };
}