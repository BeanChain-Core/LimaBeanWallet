import * as bip39 from 'bip39';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { getPublicKey } from '@noble/secp256k1';

export async function seedPhrase() {
  
  const mnemonic = bip39.generateMnemonic();

  
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  
  const seedHash = sha256(seed);
  const privateKey = bytesToHex(seedHash.slice(0, 32));

  
  const publicKeyBytes = getPublicKey(privateKey, false); 
  const publicKeyHex = bytesToHex(publicKeyBytes);

  
  const address = "BEANX:0x" + sha256(publicKeyBytes).slice(0, 20).map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    mnemonic,
    privateKey,
    publicKey: publicKeyHex,
    address
  };
}