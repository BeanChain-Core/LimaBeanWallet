import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTokenDetails, submitTransaction , fetchWalletNonce, fetchPendingTxs} from '../utils/api';
import { getPublicKeyFromPrivate, signTransaction } from '../utils/signingUtils';
import './TokenPage.css';

const TokenPage = ({ walletInfo, privateKey }) => {
  const { tokenHash } = useParams();
  const navigate = useNavigate();

  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mintAmount, setMintAmount] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState(null);
  const [nonce, setNonce] = useState(null);

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
            console.log(effectiveNonce);
          } catch (err) {
            setStatus({ type: 'error', message: '⚠️ Failed to sync nonce.' });
          }
        }
      };
  
      syncNonce();
    }, [walletInfo]);


  useEffect(() => {
    const loadToken = async () => {
      try {
        const info = await fetchTokenDetails(tokenHash);
        setTokenInfo(info);
        console.log('📦 Token Info:', info);
      } catch (err) {
        console.error('Failed to load token info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, [tokenHash]);

  const handleMintMore = async (e) => {
    e.preventDefault();
    if (!walletInfo || !privateKey || !mintAmount) {
      setMintError('Missing info. Please fill out amount.');
      return;
    }
  
    try {
      setMinting(true);
      setMintError(null);
  
      const publicKeyHex = getPublicKeyFromPrivate(privateKey);
      
  
      const txData = {
        from: walletInfo.address,
        to: 'MINTSYS',
        amount: parseFloat(mintAmount), // still needed for main TX
        gasFee: 500000, // example flat gas
        publicKeyHex,
        type: 'mint',
        meta: JSON.stringify({
          mode: 'mintMore',
          tokenHash: tokenHash,
          amount: parseFloat(mintAmount) // 👈 ADD amount inside meta too!!
        }),
      };
  
      const { txHash, signedTx } = await signTransaction(txData, privateKey, nonce);
  
      const response = await submitTransaction(txHash, signedTx);
  
      if (response?.status === 'success') {
        alert('✅ Mint More TX Sent!');
        setMintAmount('');
      } else {
        throw new Error('Mint TX failed to submit');
      }
    } catch (err) {
      console.error('❌ Mint More Error:', err);
      setMintError('Failed to submit mint transaction.');
    } finally {
      setMinting(false);
    }
  };
  

  return (
    <div className="token-page-container">
      <div className="token-card">
        <h2>Token Details</h2>

        {loading ? (
          <p>Loading token info...</p>
        ) : tokenInfo ? (
          <>
            <div className="token-info">
              <p><strong>Token Name:</strong> {tokenInfo.tokenMetaAsJson.token || 'Unknown'}</p>
              <p><strong>Symbol:</strong> {tokenInfo.tokenMetaAsJson.symbol || 'N/A'}</p>
              <p><strong>Token Hash:</strong></p>
              <p className="token-hash">{tokenInfo.tokenHash}</p>
              <p><strong>Supply:</strong> {tokenInfo.tokenMetaAsJson.supply ? (tokenInfo.tokenMetaAsJson.supply / 1e6) : 'N/A'} Tokens</p>
              <p><strong>Capped Supply:</strong> {tokenInfo.tokenMetaAsJson.mintable === false ? 'Yes' : 'No'}</p>
              <p><strong>Open Minting:</strong> {tokenInfo.tokenMetaAsJson.open ? 'Yes' : 'No'}</p>
            </div>

            <button className="send-token-btn" onClick={() => navigate(`/dashboard/send-token/${tokenHash}`)}>
              Send This Token
            </button>

            {/* 👇 If token is mintable, show mint-more form */}
            {tokenInfo.tokenMetaAsJson.open && (
              <div className="mint-more-section">
                <h3>Mint More</h3>
                <form onSubmit={handleMintMore}>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Amount to Mint"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                  />
                  <button type="submit" disabled={minting}>
                    {minting ? 'Minting...' : 'Mint More'}
                  </button>
                </form>
                {mintError && <p className="error-text">{mintError}</p>}
              </div>
            )}
          </>
        ) : (
          <p>⚠️ Failed to load token information.</p>
        )}
      </div>
    </div>
  );
};

export default TokenPage;
