import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLayer2Nonce, submitTransaction } from '../../utils/api';
import { getPublicKeyFromPrivate, signTransaction } from '../../utils/signingUtils';
import SuccessScreen from '.././messages/SuccessScreen'; // Assuming you have this already
//import './BurnTokenForm.css';

const BurnTokenForm = ({ walletInfo, privateKey }) => {
  const { tokenHash } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [gasFee, setGasFee] = useState('0.00002');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successfulTx, setSuccessfulTx] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!amount || !gasFee) {
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
        to: "BEANX:0xBURNTOKEN",
        amount: parseFloat(amount),
        gasFee: parseFloat(gasFee) * 1000000, // Convert to beantoshi (6 decimals)
        publicKeyHex,
        type: 'token',
        meta: JSON.stringify({
          tokenHash,
          amount: parseFloat(amount),
          execute: 'burn',
        }),
      };

      const { txHash, signedTx } = await signTransaction(txData, privateKey, layer2Nonce);

      const response = await submitTransaction(txHash, signedTx);

      if (response?.status === 'success') {
        setShowSuccess(true);
        setSuccessfulTx(txHash);


        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard/txexplore');
        }, 3000);
      } else {
        setStatus({ type: 'error', message: 'Burn failed to submit.' });
      }

    } catch (err) {
      console.error('Token burn failed:', err);
      setStatus({ type: 'error', message: 'Error sending burn transaction.' });
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
          <h2>Burn Token</h2>
          <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
            <strong>Token Hash:</strong> {tokenHash}
          </p>

          <form onSubmit={handleSubmit}>

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
                Enter a value with up to 6 decimals.
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
                Set the gas fee for this burn.{' '}
                
              </small>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Burning...' : 'Burn Token'}
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

export default BurnTokenForm;
