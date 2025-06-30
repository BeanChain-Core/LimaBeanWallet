import React, { useState, useEffect } from 'react';
import './TransactionForm.css';
import { signTransaction } from '../utils/signingUtils';
import { fetchWalletNonce, submitTransaction, fetchPendingTxs } from '../utils/api';
import SuccessScreen from './messages/SuccessScreen';
import { useNavigate } from 'react-router-dom';

const TransactionForm = ({ privateKey, walletInfo }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [gasFee, setGasFee] = useState('0.00002');
  const [status, setStatus] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successfulTx, setSuccessfulTx] = useState(null);
  const [recentRecipients, setRecentRecipients] = useState([]);

  const navigate = useNavigate();
  const RECENTS_KEY = 'recentRecipients';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
    setRecentRecipients(saved);
  }, []);

  useEffect(() => {
    const syncNonce = async () => {
      if (walletInfo?.address) {
        try {
          const [confirmed, pending] = await Promise.all([
            fetchWalletNonce(walletInfo.address),
            fetchPendingTxs(walletInfo.address),
          ]);
          const pendingCount = Array.isArray(pending) ? pending.length : 0;
          setNonce(confirmed + pendingCount);
        } catch (err) {
          setStatus({ type: 'error', message: '⚠️ Failed to sync nonce.' });
        }
      }
    };
    syncNonce();
  }, [walletInfo]);

  const saveRecipient = (addy) => {
    if (!addy.startsWith('BEANX:')) return;
    const updated = [addy, ...recentRecipients.filter(a => a !== addy)].slice(0, 5);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
    setRecentRecipients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = recipient.trim();
    const amountNum = Number(amount);
    const gasFeeNum = Number(gasFee);

    const hasValidDecimals = (val) => /^\d+(\.\d{1,6})?$/.test(val);

    if (!trimmed || isNaN(amountNum) || amountNum < 0.000001 || !hasValidDecimals(amount)) {
      setStatus({ type: 'error', message: 'Invalid amount. Must be ≥ 0.000001 BEAN with max 6 decimals.' });
      return;
    }

    if (!trimmed.startsWith("BEANX:0x") || trimmed.length !== 48) {
      setStatus({ type: 'error', message: '⚠️ Invalid recipient address!' });
      return;
    }

    if (isNaN(gasFeeNum) || gasFeeNum < 0.000001 || !hasValidDecimals(gasFee)) {
      setStatus({ type: 'error', message: 'Invalid gas fee. Must be ≥ 0.000001 BEAN with max 6 decimals.' });
      return;
    }

    if (nonce === null) {
      setStatus({ type: 'error', message: 'Nonce not loaded. Please wait...' });
      return;
    }

    try {
      const txData = {
        from: walletInfo.address,
        to: trimmed,
        amount: amountNum,
        gasFee: Math.round(gasFeeNum * 1_000_000),
        publicKeyHex: walletInfo.publicKey,
        type: 'transfer',
        meta: null,
      };

      const { txHash, signedTx } = await signTransaction(txData, privateKey, nonce);
      const response = await submitTransaction(txHash, signedTx);

      if (response.status === 'success') {
        setStatus({ type: 'success', message: `✅ Transaction submitted!` });
        setShowSuccess(true);
        setSuccessfulTx({ txHash, from: walletInfo.address, to: trimmed, amount: amountNum, timeStamp: Date.now() });
        saveRecipient(trimmed);
        setRecipient('');
        setAmount('');
        setNonce(nonce + 1);

        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard/txexplore');
        }, 3000);
      } else {
        throw new Error(response.message || 'Transaction failed.');
      }
    } catch (err) {
      setStatus({ type: 'error', message: `❌ ${err.message}` });
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fullscreen-overlay">
          <SuccessScreen
            txHash={successfulTx.txHash}
            amount={successfulTx.amount}
            to={successfulTx.to}
            type="transfer"
            status="success"
            tokenName="BEAN"
          />
        </div>
      )}

      <div className="tx-form-container">
        <div className="tx-form-card">
          <h2>Send BEAN</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Recipient Address</label>
              {recentRecipients.length > 0 && (
                <select value="" onChange={(e) => e.target.value && setRecipient(e.target.value)}>
                  <option value="">Select recent address</option>
                  {recentRecipients.map((addy, i) => (
                    <option key={i} value={addy}>{addy}</option>
                  ))}
                </select>
              )}
              <input
                type="text"
                placeholder="BEANX:0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value.replace(/^beanx:/i, "BEANX:"))}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Amount in BEAN"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9]*\.?[0-9]*$/.test(val) || val === '') setAmount(val);
                }}
                required
              />
              <small className="helper-text">Max 6 decimals. Min: 0.000001 BEAN.</small>
            </div>

            <div className="form-group">
              <label>Gas Fee (BEAN)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 0.00002"
                value={gasFee}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9]*\.?[0-9]*$/.test(val) || val === '') setGasFee(val);
                }}
                required
              />
              <small className="helper-text">
                <a href="/about/gasfee" >What’s gas?</a>
              </small>
            </div>

            <button type="submit" disabled={nonce === null}>Send Transaction</button>
          </form>

          {status && <p className={`status-msg ${status.type}`}>{status.message}</p>}
        </div>
      </div>
    </>
  );
};

export default TransactionForm;




