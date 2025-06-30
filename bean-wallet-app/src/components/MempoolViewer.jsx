import React from 'react';
import useMempool from './hooks/usemempool';
import './MempoolViewer.css';

const MempoolViewer = () => {
  const txs = useMempool();

  const sortedTxs = [...txs].sort((a, b) => (b.timeStamp || 0) - (a.timeStamp || 0));

  return (
    <div className="mempool-viewer">
      <h2>🔁 Live Mempool</h2>
      {sortedTxs.length === 0 ? (
        <p className="empty-msg">Waiting for mempool transactions...</p>
      ) : (
        <ul>
          {sortedTxs.map((tx, i) => (
            <li key={tx.txHash || i} className="tx-card">
              <div><strong>From:</strong> {tx.from || 'N/A'}</div>
              <div><strong>To:</strong> {tx.to || 'N/A'}</div>
              <div><strong>Amount:</strong> {tx.amount ?? 0}</div>
              <div><strong>Gas Fee:</strong> {tx.gasFee ?? 0}</div>
              <div><strong>Nonce:</strong> {tx.nonce ?? '-'}</div>
              <div><strong>Type:</strong> {tx.type || 'transfer'}</div>
              <div><strong>Timestamp:</strong> {new Date(tx.timeStamp || 0).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MempoolViewer;