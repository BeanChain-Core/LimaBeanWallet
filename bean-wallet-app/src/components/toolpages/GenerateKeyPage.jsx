import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { getPublicKey } from '@noble/secp256k1';
import './GenerateKeyPage.css';

const GenerateKeyPage = ({ onLogin }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleGenerate = () => {
    const newMnemonic = generateMnemonic(wordlist);
    const seed = mnemonicToSeedSync(newMnemonic); // returns Uint8Array
    const privateKeyHex = bytesToHex(sha256(seed).slice(0, 32));

    setMnemonic(newMnemonic);
    setPrivateKey(privateKeyHex);
  };

  const handleLogin = async () => {
    if (!privateKey) return;

    setLoading(true);
    setMessage('🔐 Logging in and creating wallet...');

    onLogin(privateKey, true);

    const pubKeyHex = bytesToHex(getPublicKey(privateKey));
    const walletAddress = `BEANX:${pubKeyHex.slice(0, 40)}`;

    try {
      await fetch(`https://limabean.xyz/api/nonce/${walletAddress}`);
      setMessage('✅ Wallet created! Opening Wallet Dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Wallet creation error:', err);
      setMessage('❌ Error creating wallet. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="generate-key-container">
      <div className="generate-key-card">
        <h2>🔐 Generate New Wallet</h2>

        {loading ? (
          <p className="loading-message">{message}</p>
        ) : !privateKey ? (
          <button onClick={handleGenerate}>Generate Wallet (Seed Phrase)</button>
        ) : (
          <>
            <p className="key-label">🧠 Save your seed phrase:</p>
            <pre className="private-key-box">{mnemonic}</pre>

            <p className="seed-info-link">
              <a href="/about/seed-phrases" target="_blank" rel="noopener noreferrer">
                What is a seed phrase?
              </a>
            </p>

            <p className="key-label">🔐 Private Key:</p>
            <pre className="private-key-box">{privateKey}</pre>

            <p className="warning">
              ⚠️ Write this down! If you lose your seed phrase or private key, your wallet can't be recovered.
            </p>

            <button onClick={handleLogin}>Sign in to New Wallet</button>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateKeyPage;


