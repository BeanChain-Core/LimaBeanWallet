import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLayer2Nonce, submitTransaction } from '../utils/api';
import { getPublicKeyFromPrivate, signTransaction } from '../utils/signingUtils';

const SendTokenForm = ({ walletInfo, privateKey }) => {
  const { tokenHash } = useParams();
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      if (!recipient || !amount) {
        alert('Please fill out recipient and amount.');
        return;
      }

      setLoading(true);

      // 🔥 Fetch Layer2 nonce, fallback to 0
      let layer2Nonce = 0;
      try {
        const fetchedNonce = await fetchLayer2Nonce(walletInfo.address);
        if (typeof fetchedNonce === 'number' && fetchedNonce >= 0) {
          layer2Nonce = fetchedNonce;
        }
      } catch (err) {
        console.warn('⚠️ Failed to fetch Layer2 nonce, using 0 as fallback.');
      }

      const publicKeyHex = getPublicKeyFromPrivate(privateKey);

      // 🛠 Build a raw txData object
      const txData = {
        from: walletInfo.address,
        to: recipient,
        amount: parseFloat(amount),
        gasFee: 100, // in BEANTOSHI
        publicKeyHex,
        type: 'token',
        meta: JSON.stringify({
          tokenHash,
          amount: parseFloat(amount),
        }),
      };

      // ✍️ Sign and finalize TX
      const { txHash, signedTx } = await signTransaction(txData, privateKey, layer2Nonce);

      console.log('🚀 TokenTX Ready:', signedTx);

      // 📤 Submit TX
      const response = await submitTransaction(txHash, signedTx);

      if (response?.status === 'success') {
        alert('✅ Token transaction submitted!');
        navigate('/'); // Go back to dashboard or wherever you want
      } else {
        alert('❌ Failed to submit token transaction.');
      }

    } catch (err) {
      console.error('❌ Token send failed:', err);
      alert('Error sending token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-token-form">
      <h2>Send Token</h2>
      <p><strong>Token Hash:</strong> {tokenHash}</p>

      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default SendTokenForm;
