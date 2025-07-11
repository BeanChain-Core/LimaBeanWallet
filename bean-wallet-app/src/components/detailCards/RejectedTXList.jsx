import React, { useEffect, useState } from 'react';
import { fetchAllRejectedTxs } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './TXDetails.css'; // reuse existing styles

const RejectedTXList = () => {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllRejectedTxs();
      setTxs(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="tx-details-container">
      <h2>All Rejected Transactions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : txs.length === 0 ? (
        <p>No rejected transactions found.</p>
      ) : (
        <div className="tx-list">
          {txs.map((tx) => (
            <div
              className="tx-card rejected"
              key={tx.txHash}
              onClick={() => navigate(`/rejected/${tx.txHash}`)}
            >
              <p><strong>Hash:</strong> {tx.txHash.slice(0, 28)}...</p>
              <p><strong>From:</strong> {tx.from}</p>
              <p><strong>To:</strong> {tx.to}</p>
              <p><strong>Nonce:</strong> {tx.nonce}</p>
              <p><strong>Time:</strong> {new Date(tx.timeStamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RejectedTXList;