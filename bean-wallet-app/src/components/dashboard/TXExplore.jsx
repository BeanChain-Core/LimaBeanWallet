import React, { useEffect, useState } from 'react';
import './TXExplore.css';
import { fetchAllTxsForWallet } from '../../utils/api';
import BeanError from '../messages/BeanError';
import { useNavigate } from 'react-router-dom';


const TXExplore = ({ walletInfo }) => {
  const walletAddress = walletInfo?.address;
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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

  const groupTxsByDirectionStatusType = (txs) => {
    const grouped = {};

    txs.forEach(tx => {
      const direction = tx.from === walletAddress ? 'Sent' : 'Received';
      const status = tx.status ?? 'unknown';
      const type = tx.type ?? 'unknown';

      if (!grouped[direction]) grouped[direction] = {};
      if (!grouped[direction][status]) grouped[direction][status] = {};
      if (!grouped[direction][status][type]) grouped[direction][status][type] = [];

      grouped[direction][status][type].push(tx);
    });

    return grouped;
  };

  const renderGroupedTxs = (grouped) => {
    return Object.entries(grouped).map(([direction, statuses]) => (
      <div key={direction} className="direction-section">
        <h1 className="direction-header">{direction} Transactions</h1>
        {Object.entries(statuses).map(([status, types]) => (
          <div key={status} className="status-subsection">
            <h2 className="status-header">{formatStatus(status)}</h2>
            {Object.entries(types).map(([type, txList]) => (
              <div key={type} className="type-subsection">
                <h3 className="type-header">➔ {type.toUpperCase()} TXs</h3>
                {txList.length ? txList.map(renderTx) : <p>No {type} transactions.</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    ));
  };

  const renderTx = (tx) => (
    <div
      className="tx-card"
      key={tx.txHash}
      onClick={() => navigate(`/tx/${tx.txHash}`)}
    >
      <p><strong>Hash:</strong> {tx.txHash.slice(0, 24)}...</p>
      <p><strong>Nonce:</strong> {tx.nonce}</p>
      <p><strong>Time:</strong> {new Date(tx.timeStamp).toLocaleString()}</p>
    </div>
  );

  const formatStatus = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'rejected': return '❌ Failed';
      case 'complete': return '✅ Complete';
      default: return '❓ Unknown';
    }
  };

  if (error) return <BeanError message={error} />;

  return (
    <div className="tx-explore-container">
      <h1>TX Explorer</h1>
      <input
        type="text"
        placeholder="Search by TX hash..."
        className="tx-search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {renderGroupedTxs(
        groupTxsByDirectionStatusType(
          txs.filter(tx =>
            tx.txHash.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      )}
    </div>
  );
};

export default TXExplore;



