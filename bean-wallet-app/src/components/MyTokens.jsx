import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyTokens } from '../utils/api'; 
import './MyToken.css';

const MyTokens = ({ walletInfo }) => {
  const [tokens, setTokens] = useState([]);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const data = await fetchMyTokens(walletInfo.address);

        if (Array.isArray(data)) {
          setTokens(data);
        } else {
          setStatus({ type: 'error', message: 'Failed to load tokens' });
        }
      } catch (err) {
        console.error('❌ Error loading tokens:', err);
        setStatus({ type: 'error', message: 'Server error while fetching tokens' });
      }
    };

    if (walletInfo?.address) loadTokens();
  }, [walletInfo]);

  return (
    <div className="token-container">
      <h2>Your Tokens</h2>

      {status && <p className={`status-msg ${status.type}`}>{status.message}</p>}

      {tokens.length === 0 ? (
        <p>No tokens found in this wallet.</p>
      ) : (
        <div className="token-grid">
          {tokens.map((token, idx) => (
            <div
              key={idx}
              className="token-card"
              // onClick={() => navigate(`/token/${token.tokenHash}`)}
            >
              <div className="token-name">
                {token.token} ({token.symbol})
              </div>
              <div className="token-balance">Balance: {token.balance}</div>
              <div className="token-flags">
                {token.capped && <span className="flag capped">Capped</span>}
                {token.openMint && <span className="flag open">Open Mint</span>}
              </div>
              <div className="token-hash">
                Hash: <code>{token.tokenHash.slice(0, 12)}...</code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTokens;
