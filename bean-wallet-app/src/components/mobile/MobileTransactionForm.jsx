import React, { useState, useEffect } from 'react';
import { signTransaction } from '../../utils/signingUtils';
import { fetchWalletNonce, submitTransaction } from '../../utils/api';
import SuccessScreen from '../messages/SuccessScreen';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../utils/QRScanner';
import { useSearchParams } from 'react-router-dom';
import './MobileTransactionForm.css'; 

const MobileTransactionForm = ({ privateKey, walletInfo }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [gasFee, setGasFee] = useState('0.00002');
  const [status, setStatus] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successfulTx, setSuccessfulTx] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLocked, setIsLocked] = useState(false);

  const handleScanned = (scanned) => {
    if (scanned.startsWith("BEANX:") && scanned.length === 48) {
      setRecipient(scanned);
      setShowScanner(false);
    } else {
      alert("⚠️ Invalid BEANX address.");
    }
  };
  useEffect(() => {
    const param = searchParams.get('address');
    if (param && param.startsWith('BEANX:0x') && param.length === 48) {
      setRecipient(param);
      setIsLocked(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (walletInfo?.address) {
      fetchWalletNonce(walletInfo.address)
        .then(setNonce)
        .catch(() => {
          setStatus({ type: 'error', message: '⚠️ Failed to fetch nonce.' });
        });
    }
  }, [walletInfo]);

  const hasValidDecimals = (val) => /^\d+(\.\d{1,6})?$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedRecipient = recipient.trim();
    const amountNum = Number(amount);
    const gasFeeNum = Math.round(parseFloat(gasFee) * 1e6);
    const timeStamp = Date.now();


    if (!trimmedRecipient || isNaN(amountNum) || amountNum < 0.000001 || !hasValidDecimals(amount)) {
      setStatus({ type: 'error', message: '❌ Invalid amount. Must be ≥ 0.000001 with up to 6 decimals.' });
      return;
    }

    if (isNaN(gasFeeNum) || gasFeeNum < 0.000001 || !hasValidDecimals(gasFee)) {
      setStatus({ type: 'error', message: '❌ Invalid gas fee. Must be ≥ 0.000001 with up to 6 decimals.' });
      return;
    }

    if (!recipient.startsWith("BEANX:0x") || recipient.length !== 48) {
      alert("⚠️ Invalid recipient address!");
      return;
    }

    if (nonce === null) {
      setStatus({ type: 'error', message: 'Nonce not loaded. Please wait...' });
      return;
    }

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

      console.log("🚨 TX DEBUG:");
      console.log("GAS INPUT STRING:", gasFee);
      console.log("Parsed gasFeeNum:", gasFeeNum);
      console.log("TX DATA SENDING TO SIGN:", {
        from: walletInfo.address,
        to: trimmedRecipient,
        amount: parseFloat(amount).toFixed(6),
        gasFee: gasFeeNum,
        timeStamp
      });

      const { txHash, signedTx } = await signTransaction(txData, privateKey, nonce);
      const response = await submitTransaction(txHash, signedTx);

      if (response.status === 'success') {
        setStatus({ type: 'success', message: `✅ Transaction submitted!` });
        setShowSuccess(true);
        setSuccessfulTx({
          txHash,
          from: walletInfo.address,
          to: trimmedRecipient,
          amount: amountNum,
          timeStamp: timeStamp
        });

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
    <div className="mobile-transaction-form-container" style={{ padding: '1rem', maxWidth: '420px', margin: 'auto' }}>
      {showSuccess && <SuccessScreen tx={successfulTx} />}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', textAlign:'center' }}>Send BEAN</h2>
      
      <form onSubmit={handleSubmit}>
        <label>Recipient</label>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            value={recipient}
            onChange={(e) => {
              let value = e.target.value;
              value = value.replace(/^beanx:/i, "BEANX:");
              setRecipient(value);
            }}
            placeholder="BEANX:0x..."
            style={{ flex: 1, marginRight: '0.5rem' }}
            required
            disabled={isLocked}
          />
          <button type="button" className="qr-scan-button" onClick={() => setShowScanner(true)}>📷</button>
        </div>
  
        {showScanner && (
          <QRScanner 
            onScan={(scanned) => {
              if (scanned.startsWith("BEANX:") && scanned.length === 48) {
                setRecipient(scanned);
                setShowScanner(false);
              } else {
                alert("⚠️ Invalid BEANX address.");
              }
            }}
            onCancel={() => setShowScanner(false)}
          />
        )}
  
        <label>Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 1.000001"
          inputMode="decimal"
          style={{ width: '100%', marginBottom: '0.5rem' }}
          required
        />
        <small style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', display: 'block' }}>
          Must be ≥ 0.000001 BEAN, max 6 decimals
        </small>
  
        <label>Gas Fee</label>
        <input
          type="text"
          value={gasFee}
          onChange={(e) => setGasFee(e.target.value)}
          placeholder="e.g. 0.00002"
          inputMode="decimal"
          style={{ width: '100%', marginBottom: '0.5rem' }}
          required
        />
        <small style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', display: 'block' }}>
          Gas fee ≥ 0.000001 BEAN.{' '}
          <a href="/about/beantoshi" >What’s a beantoshi?</a>
        </small>
  
        <button type="submit" disabled={nonce === null} style={{ width: '100%' }}>
          Send Transaction
        </button>
  
        {status && (
          <p style={{ color: status.type === 'error' ? 'red' : 'green', marginTop: '1rem' }}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
export default MobileTransactionForm;
