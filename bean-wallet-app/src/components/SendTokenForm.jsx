import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLayer2Nonce, submitTransaction } from '../utils/api';
import { getPublicKeyFromPrivate, signTransaction } from '../utils/signingUtils';
import SuccessScreen from './SuccessScreen'; // Assuming you have this already
import './SendTokenForm.css';

const SendTokenForm = ({ walletInfo, privateKey }) => {
  const { tokenHash } = useParams();
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [gasFee, setGasFee] = useState('0.00002');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successfulTx, setSuccessfulTx] = useState('');
  const [recentRecipients, setRecentRecipients] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!recipient || !amount || !gasFee) {
        setStatus({ type: 'error', message: 'Please fill out all fields.' });
        return;
      }

      setLoading(true);
      setStatus(null);

      // Fetch Layer2 nonce, fallback to 0
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

      const txData = {
        from: walletInfo.address,
        to: recipient,
        amount: parseFloat(amount),
        gasFee: parseFloat(gasFee) * 1000000, // Convert to beantoshi (6 decimals)
        publicKeyHex,
        type: 'token',
        meta: JSON.stringify({
          tokenHash,
          amount: parseFloat(amount),
        }),
      };

      const { txHash, signedTx } = await signTransaction(txData, privateKey, layer2Nonce);

      const response = await submitTransaction(txHash, signedTx);

      if (response?.status === 'success') {
        setShowSuccess(true);
        setSuccessfulTx(txHash);

        // Save recent recipient
        setRecentRecipients(prev => {
          const updated = [recipient, ...prev.filter(r => r !== recipient)];
          return updated.slice(0, 5); // Keep only latest 5
        });

        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard/txexplore');
        }, 3000);
      } else {
        setStatus({ type: 'error', message: 'Transaction failed to submit.' });
      }

    } catch (err) {
      console.error('❌ Token send failed:', err);
      setStatus({ type: 'error', message: 'Error sending transaction.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fullscreen-overlay">
          <SuccessScreen tx={successfulTx} />
        </div>
      )}

      <div className="tx-form-container">
        <div className="tx-form-card">
          <h2>Send Token</h2>
          <p><strong>Token Hash:</strong> {tokenHash}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="recipient">Recipient Address</label>
              {recentRecipients.length > 0 && (
                <select
                  onChange={(e) => e.target.value && setRecipient(e.target.value)}
                  value=""
                >
                  <option value="">⬇️ Select from recent recipients</option>
                  {recentRecipients.map((addy, idx) => (
                    <option key={idx} value={addy}>{addy}</option>
                  ))}
                </select>
              )}
              <input
                id="recipient"
                type="text"
                placeholder="BEANX:0x..."
                value={recipient}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/^beanx:/i, "BEANX:");
                  setRecipient(value);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                pattern="^\d+(\.\d{1,8})?$"
                placeholder="Amount in Token"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9]*\.?[0-9]*$/.test(val) || val === '') {
                    setAmount(val);
                  }
                }}
                required
              />
              <small className="helper-text">
                Enter a value with up to 8 decimals.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="gasFee">Gas Fee (BEAN)</label>
              <input
                id="gasFee"
                type="text"
                inputMode="decimal"
                placeholder="0.00002"
                value={gasFee}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9]*\.?[0-9]*$/.test(val) || val === '') {
                    setGasFee(val);
                  }
                }}
                required
              />
              <small className="helper-text">
                Set the gas fee for this transaction.{' '}
                
              </small>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Token'}
            </button>
          </form>

          {status && (
            <p className={`status-msg ${status.type}`}>{status.message}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SendTokenForm;
