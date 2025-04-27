import React, { useState, useEffect } from 'react';
import './TransactionForm.css';
import { signTransaction } from '../utils/signingUtils';
import { fetchWalletNonce, submitTransaction, fetchPendingTxs } from '../utils/api';
import SuccessScreen from './SuccessScreen';
import { useNavigate } from 'react-router-dom';

const TransactionForm = ({ privateKey, walletInfo }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successfulTx, setSuccessfulTx] = useState(null);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [gasFee, setGasFee] = useState('0.00002');

  const navigate = useNavigate();
  const RECENTS_KEY = 'recentRecipients';

  // Load recent recipients from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
    setRecentRecipients(saved);
  }, []);

  // Load nonce whenever wallet changes
  useEffect(() => {
    const syncNonce = async () => {
      if (walletInfo?.address) {
        try {
          const [confirmed, pending] = await Promise.all([
            fetchWalletNonce(walletInfo.address),
            fetchPendingTxs(walletInfo.address),
          ]);
  
          const pendingCount = Array.isArray(pending) ? pending.length : 0;
          const effectiveNonce = confirmed + pendingCount;
  
          console.log(`⛓️ Synced Nonce: ${confirmed} + ${pendingCount} pending → ${effectiveNonce}`);
  
          setNonce(effectiveNonce);
        } catch (err) {
          setStatus({ type: 'error', message: '⚠️ Failed to sync nonce.' });
        }
      }
    };
  
    syncNonce();
  }, [walletInfo]);
  

  const saveRecipient = (addy) => {
    if (!addy || !addy.startsWith('BEANX:')) return;
    const updated = [addy, ...recentRecipients.filter(a => a !== addy)].slice(0, 5);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
    setRecentRecipients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedRecipient = recipient.trim();
    const amountNum = Number(amount);
    const gasFeeNum = Number(gasFee);

    const hasValidDecimals = (val) => {
      return /^\d+(\.\d{1,6})?$/.test(val); // 6 decimal places max
    };

    if (!trimmedRecipient || isNaN(amountNum) || amountNum < 0.000001 || !hasValidDecimals(amount)) {
      setStatus({
        type: 'error',
        message: 'Invalid amount. Must be ≥ 0.000001 BEAN with max 6 decimals.',
      });
      return;
    }

    if (!recipient.startsWith("BEANX:0x") || recipient.length !=48) {
      alert("⚠️ Invalid recipient address!");
      return;
    }

    if (isNaN(gasFeeNum) || gasFeeNum < 0.000001 || !hasValidDecimals(gasFee)) {
      setStatus({
        type: 'error',
        message: 'Invalid gas fee. Must be ≥ 0.000001 BEAN with max 6 decimals.',
      });
      return;
    }


    if (nonce === null) {
      setStatus({ type: 'error', message: 'Nonce not loaded. Please wait...' });
      return;
    }

    console.log("📦 walletInfo:", walletInfo);

    try {
      const txData = {
        from: walletInfo.address,
        to: trimmedRecipient,
        amount: amountNum,
        gasFee: Math.round(gasFeeNum * 1_000_000),
        publicKeyHex: walletInfo.publicKey,
        type: 'transfer', 
        meta: null
      };

      //console.log("🔐 Signing TX:", { txData, privateKey, nonce });

      
      const { txHash, signedTx } = await signTransaction(txData, privateKey, nonce);
      const response = await submitTransaction(txHash, signedTx);

      
      console.log("📤 Response from API:", response);

      if (response.status === 'success') {
        setStatus({ type: 'success', message: `✅ Transaction submitted!` });
        setShowSuccess(true);
        setSuccessfulTx({
          txHash,
          from: walletInfo.address,
          to: trimmedRecipient,
          amount: amountNum,
          timeStamp: Date.now()
        });

        saveRecipient(trimmedRecipient);
        setRecipient('');
        setAmount('');
        setNonce(nonce + 1); // optimistic update

        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard/txexplore');
        }, 3000);
      } else {
        throw new Error(response.message || 'Transaction failed.');
      }
    } catch (err) {
      console.error('❌ TX Error:', err);
      setStatus({ type: 'error', message: `❌ ${err.message}` });
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
          <h2>Send BEAN</h2>
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
                placeholder="Amount in BEAN"
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
                Enter a value with up to 6 decimals. Min: 0.000001 BEAN.
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
                Set the gas fee for this transaction. Must be ≥ 0.000001.{' '}
                <a href="/about/beantoshi" target="_blank" rel="noopener noreferrer">What’s a beantoshi?</a>
              </small>
            </div>
            <small className="helper-text">
              Need help? <a href="/about/gasfee" target="_blank">What's a gas fee?</a> 
            </small>


            <button type="submit" disabled={nonce === null}>
              Send Transaction
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

export default TransactionForm;




