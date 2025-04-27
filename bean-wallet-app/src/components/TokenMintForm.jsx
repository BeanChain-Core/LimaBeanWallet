import React, { useState, useEffect } from 'react';
import './TokenMintForm.css';
import { signTransaction } from '../utils/signingUtils';
import { fetchWalletNonce, fetchPendingTxs, submitTransaction } from '../utils/api';
import SuccessScreen from './SuccessScreen';
import { useNavigate } from 'react-router-dom';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

const TokenMintForm = ({ privateKey, walletInfo }) => {
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [capped, setCapped] = useState(false);
  const [openMint, setOpenMint] = useState(false);
  const [status, setStatus] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successfulTx, setSuccessfulTx] = useState(null);

  const navigate = useNavigate();

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

          setNonce(effectiveNonce);
        } catch (err) {
          setStatus({ type: 'error', message: '⚠️ Failed to sync nonce.' });
        }
      }
    };

    syncNonce();
  }, [walletInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = tokenName.trim();
    const amount = Number(supply);

    if (!token || !symbol || isNaN(amount) || amount < 1 || symbol.length > 4) {
      setStatus({ type: 'error', message: '❌ Please fill out all fields correctly.' });
      return;
    }

    if (nonce === null) {
      setStatus({ type: 'error', message: 'Nonce not loaded. Please wait...' });
      return;
    }

    try {
      const from = walletInfo.address;
      const publicKeyHex = walletInfo.publicKey;
      const tokenHash = bytesToHex(
        sha256(new TextEncoder().encode(from + token + amount + symbol))
      );

      const meta = JSON.stringify({
        mode: 'create',
        token,
        tokenHash,
        supply: amount,
        symbol,
        capped,
        openMint
      });

      const gasFee = amount * 1;

      const txData = {
        from,
        to: 'MINTSYS',
        amount,
        gasFee: Math.round(gasFee),
        publicKeyHex,
        timeStamp: Date.now(),
        type: 'mint',
        meta
      };

      const { txHash, signedTx } = await signTransaction(txData, privateKey, nonce);
      const response = await submitTransaction(txHash, signedTx);

      if (response.status === 'success') {
        setStatus({ type: 'success', message: '✅ Token MintTX submitted!' });
        setShowSuccess(true);
        setSuccessfulTx({
          txHash,
          from,
          to: 'MINTSYS',
          amount,
          timeStamp: Date.now()
        });

        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard/txexplore');
        }, 3000);
      } else {
        throw new Error(response.message || 'Transaction rejected.');
      }
    } catch (err) {
      console.error('❌ MintTX Error:', err);
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
          <h2>Mint a New Token</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Token Name</label>
              <input
                type="text"
                placeholder="e.g. GreenBean"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Token Symbol</label>
              <input
                type="text"
                placeholder="e.g. GBE (max 4 char)"
                maxLength={4}
                value={symbol}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  if (/^[A-Za-z]{0,4}$/.test(val)) setSymbol(val);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Initial Supply</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 1000"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                required
              />
            </div>

            
            
          
            {!openMint && (
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={capped}
                    onChange={() => {
                      const newCapped = !capped;
                      setCapped(newCapped);
                      if (newCapped) {
                        setOpenMint(false); 
                      }
                    }}
                  />
                  Cap Supply
                </label>
              </div>
            )}

            
            {!capped && (
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={openMint}
                    onChange={() => {
                      const newOpenMint = !openMint;
                      setOpenMint(newOpenMint);
                      if (newOpenMint) {
                        setCapped(false); 
                      }
                    }}
                  />
                  Allow Public Minting
                </label>
              </div>
            )}

            <button type="submit" disabled={nonce === null}>Mint Token</button>
          </form>
          {status && <p className={`status-msg ${status.type}`}>{status.message}</p>}
        </div>
      </div>
    </>
  );
};

export default TokenMintForm;


