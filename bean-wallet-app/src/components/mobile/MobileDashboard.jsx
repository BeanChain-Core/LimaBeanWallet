import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import QRCode from '../utils/QRCode';
import FaucetDripButton from '../utils/FaucetDripButton';
import { IS_GHOSTNET } from '../../config';
import { fetchMyTokens } from '../../utils/api';
import './MobileDashboard.css';

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-section">
      <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
};

const MobileDashboard = ({ walletInfo, privateKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const beanImage = IS_GHOSTNET ? "/GhostBean.png" : "/WalletBean.png";
  const [tokenBalances, setTokenBalances] = useState([]);

  useEffect(() => {
    if (walletInfo?.address) {
      fetchMyTokens(walletInfo.address).then(setTokenBalances).catch(console.error);
    }
  }, [walletInfo?.address]);

  if (!walletInfo) return null;

  return (
    <div className="mobile-dashboard">
      <img src={beanImage} alt="Bean Avatar" className="mobile-bean-avatar" />

      {/* Top balance + action bar */}
      <div className="mobile-balance-bar">
        <div className="balance-label">$BEAN:</div>
        <div className="balance-amount">{walletInfo.balance ?? 'Loading...'}</div>
        
        <div className="action-buttons">
          <button onClick={() => navigate('/dashboard/send')}>SEND</button>
          <FaucetDripButton address={walletInfo?.address} />
        </div>

        {tokenBalances.length > 0 && (
          <CollapsibleSection title="Token Balances">
            <div className="mobile-token-list">
              {tokenBalances.map((token, i) => (
                <div key={i} className="mobile-token-item">
                  <strong>{token.symbol}</strong>: {token.balance}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </div>

      <CollapsibleSection title="Wallet Info">
        <div className="mobile-section">
          <label>Address:</label>
          <div className="mobile-box">{walletInfo.address}</div>
        </div>
        <div className="mobile-section">
          <label>Public Key:</label>
          <pre className="mobile-key">{walletInfo.publicKey}</pre>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="QR Code">
        <div className="dashboard-section">
          <QRCode data={walletInfo.address} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Navigate">
        <div className="mobile-actions">
          <button onClick={() => navigate('/dashboard/mint')}>MINT</button>
          <button onClick={() => navigate('/dashboard/tokens')}>MY TOKENS</button>
          <button onClick={() => navigate('/dashboard/txexplore')}>TRANSACTIONS</button>
        </div>
      </CollapsibleSection>

      <Outlet />
      <div className='spacer'></div>
    </div>
  );
};

export default MobileDashboard;
