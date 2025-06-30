import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { resolveAlias } from '../../utils/aliases';
import {
  fetchWalletBalance,
  fetchMyTokens,
  fetchAllTxsForWallet
} from '../../utils/api';
import './WalletViewer.css';

export default function WalletViewer() {
  const { address } = useParams();
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWalletInfo() {
      setLoading(true);
      const [bal, tokenList, txList] = await Promise.all([
        fetchWalletBalance(address),
        fetchMyTokens(address),
        fetchAllTxsForWallet(address)
      ]);

      setBalance(bal);
      setTokens(tokenList);
      setTransactions(txList);
      setLoading(false);
    }

    loadWalletInfo();
  }, [address]);

  if (loading) return <div className="wallet-loading">Loading wallet data...</div>;
  if (!address) return <div className="wallet-error">Invalid address.</div>;

  return (
    <div className="wallet-viewer">
      <h2>Wallet Info</h2>
      <div className="wallet-section">
        <strong>Address:</strong>
        <div className="wallet-address"><span title={address}>{resolveAlias(address)}</span></div>
      </div>

      <div className="wallet-section bean">
        <strong>BEAN Balance:</strong>
        <div>{balance ?? '—'} BEAN</div>
      </div>

      <div className="wallet-section">
        <strong>Tokens:</strong>
        {tokens.length === 0 ? (
          <div>No tokens found</div>
        ) : (
          <ul>
            {tokens.map(t => (
              <li key={t.tokenHash}>
                {t.symbol}: {t.balance}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="wallet-section">
        <h3>Transactions</h3>

        <TxGroup
            title="Pending Transactions"
            txList={transactions.filter(tx => tx.status === 'pending')}
            renderTx={tx => (
                <Link to={`/tx/${tx.txHash}`}><>[PENDING] {tx.type} {tx.amount} → <span title={tx.to}>{resolveAlias(tx.to)}</span></></Link>
            )}
        />

        <TxGroup
            title="Confirmed – Sent"
            txList={transactions.filter(tx => tx.status === 'complete' && tx.from === address)}
            renderTx={tx => {
                console.log("TX to/recipient:", tx.to, tx.recipient); // ✅ this now runs properly
                return (
                <Link to={`/tx/${tx.txHash}`}>
                    <>{tx.type} {tx.amount} → <span title={tx.to}>{resolveAlias(tx.to)}</span></>
                </Link>
                );
            }}
        />

        <TxGroup
            title="Confirmed – Received"
            txList={transactions.filter(tx => tx.status === 'complete' && tx.to === address)}
            renderTx={tx => (
            <Link to={`/tx/${tx.txHash}`}><>{tx.type} {tx.amount} ← <span title={tx.from}>{resolveAlias(tx.from)}</span></></Link>
            )}
        />

        <TxGroup
            title="Failed Transactions"
            txList={transactions.filter(tx => tx.status === 'rejected')}
            renderTx={tx => (
            <Link to={`/tx/${tx.txHash}`}><>❌ {tx.type} {tx.amount} → <span title={tx.to}>{resolveAlias(tx.to)}</span></></Link>
            )}
        />
        </div>
    </div>
  );
}

function formatTime(ts) {
  return new Date(ts).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function TxGroup({ title, txList, renderTx }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="tx-group">
      <div className="tx-header" onClick={() => setOpen(!open)}>
        {open ? '🔽' : '▶️'} {title} ({txList.length})
      </div>
      {open && (
        <ul className="tx-list">
          {txList.map(tx => (
            <li key={tx.txHash}>
              {renderTx(tx)}
              <div className="tx-timestamp">{formatTime(tx.timeStamp)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
