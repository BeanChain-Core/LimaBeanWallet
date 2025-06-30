import React, { useState } from 'react';
import { utils } from '@noble/secp256k1';
import { bytesToHex } from '@noble/hashes/utils';
import { useNavigate } from 'react-router-dom';
import './GenerateKeyPage.css';

const GenerateKeyPage = ({ onLogin }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleGenerate = () => {
    const raw = utils.randomPrivateKey();
    const hex = bytesToHex(raw);
    setPrivateKey(hex);
  };

  const handleLogin = async () => {
    if (!privateKey) return;

    setLoading(true);
    setMessage('🔐 Logging in and creating wallet...');
    
    onLogin(privateKey, true); // Update state before redirect

    const { getPublicKey } = await import('@noble/secp256k1');
    const pubKeyHex = bytesToHex(getPublicKey(privateKey));
    const walletAddress = `BEANX:${pubKeyHex.slice(0, 40)}`;

    try {
      await fetch(`https://limabean.xyz/api/nonce/${walletAddress}`);
      setMessage('✅ Wallet created! Opening Wallet Dashboard');

      setTimeout(() => {
        navigate('/dashboard'); // 🔁 Direct to the correct page
      }, 1500);
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
          <button onClick={handleGenerate}>Generate Private Key</button>
        ) : (
          <>
            <p className="key-label">🧠 This is your private key:</p>
            <pre className="private-key-box">{privateKey}</pre>
            <p className="warning">
              ⚠️ Save this key somewhere safe. If you lose it, you lose access to your tokens.
            </p>
            <button onClick={handleLogin}>Sign in to New Wallet</button>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateKeyPage;


