import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTxByHash } from '../../utils/api';
import { Link } from 'react-router-dom';
import './TXDetails.css'; 
import { resolveAlias } from '../../utils/aliases';
import MetaDisplay from '../utils/MetaDisplay';

const TXDetails = () => {
  const { txHash } = useParams();
  const [tx, setTx] = useState(null);
  const [error, setError] = useState(null);
  


  useEffect(() => {
    const loadTx = async () => {
      try {
        const txData = await fetchTxByHash(txHash);
        setTx(txData);
      } catch (err) {
        console.error('❌ Failed to load TX:', err);
        setError('Could not load transaction.');
      }
    };

    if (txHash) loadTx();
  }, [txHash]);

  if (error) return <div className="error-message">{error}</div>;
  if (!tx) return <div className="loading-message">Loading transaction...</div>;

  function safeJsonParse(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return { raw: str };
    }
  }
  
  return (
    <div className="tx-details-container">
      <h2>Transaction Details</h2>
      <div className="tx-detail-card">
        <p><strong>Hash:</strong> {tx.txHash}</p>
        <p><strong>Status:</strong> {tx.status}</p>
        <p><strong>Type:</strong> {tx.type}</p>
        <Link to={`/wallet/${tx.from}`}><p><strong>From:</strong> <span title={tx.from}>{resolveAlias(tx.from)}</span></p></Link>
        <Link to={`/wallet/${tx.to}`}><p><strong>To:</strong> $<span title={tx.to}>{resolveAlias(tx.to)}</span></p></Link>
        <p><strong>Amount:</strong> {tx.amount}</p>
        <p><strong>Gas Fee:</strong> {(tx.gasFee / 1e8).toFixed(8)} BEAN</p>
        <p><strong>Nonce:</strong> {tx.nonce}</p>
        <p><strong>Timestamp:</strong> {new Date(tx.timeStamp).toLocaleString()}</p>
        {tx.meta && (
          <div className="tx-meta">
            <strong>Metadata:</strong>
            <pre>{typeof tx.meta === 'string' ? tx.meta : JSON.stringify(tx.meta, null, 2)}</pre>
            <MetaDisplay
              meta={typeof tx.meta === 'string' ? safeJsonParse(tx.meta) : tx.meta}  
            /> 
          </div>
        )}
      </div>
    </div>
  );
};

export default TXDetails;
