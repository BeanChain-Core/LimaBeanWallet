// src/components/TXExplore.jsx
import React, { useEffect, useState } from 'react';
import './TXExplore.css';
import { fetchAllTxsForWallet } from '../utils/api';
import BeanError from './BeanError';
import { useNavigate } from 'react-router-dom';


const TXExplore = ({ walletInfo }) => {
  const walletAddress = walletInfo?.address;
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (!walletAddress) {
      setError('No wallet connected. Please log in to view your transactions.');
      return;
    }

    const loadAllTxs = async () => {
      try {
        const allTxs = await fetchAllTxsForWallet(walletAddress);
        const sorted = allTxs.sort((a, b) => b.timeStamp - a.timeStamp);
        setTxs(sorted);
      } catch (err) {
        console.error('❌ TXExplore error:', err);
        setError('Could not load transactions. Check your connection or try again later.');
      }
    };

    loadAllTxs();
    const interval = setInterval(loadAllTxs, 60000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  const renderTxList = (statusLabel, icon, filter) => {
    const filtered = txs.filter(filter);
    return (
      <section>
        <h3>{icon} {statusLabel}</h3>
        {filtered.length ? filtered.map(renderTx) : <p>No {statusLabel.toLowerCase()} txs.</p>}
      </section>
    );
  };

  const renderTx = (tx) => (
    <div
      className="tx-card"
      key={tx.txHash}
      onClick={() => navigate(`/tx/${tx.txHash}`)}
    >
      <p><strong>Hash:</strong> {tx.txHash.slice(0, 12)}...</p>
      <p><strong>Type:</strong> {tx.type ?? 'unknown'}</p>
      <p><strong>Nonce:</strong> {tx.nonce}</p>
      <p><strong>Time:</strong> {new Date(tx.timeStamp).toLocaleString()}</p>
    </div>
  );

  if (error) return <BeanError message={error} />;

  return (
    <div className="tx-explore-container">
      <h2>TX Explorer</h2>
      {renderTxList('Pending TXs', '⏳', tx => tx.status === 'pending')}
      {renderTxList('Failed TXs', '❌', tx => tx.status === 'rejected')}
      {renderTxList('Sent TXs', '✅', tx => tx.from === walletAddress && tx.status === 'complete')}
      {renderTxList('Received TXs', '📥', tx => tx.to === walletAddress && tx.status === 'complete')}
    </div>
  );
};

export default TXExplore;

