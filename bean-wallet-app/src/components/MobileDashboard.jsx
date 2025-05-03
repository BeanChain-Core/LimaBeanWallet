// src/components/MobileDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import './MobileDashboard.css';
import { Outlet } from 'react-router-dom';
import QRCode from './QRCode';
import { IS_GHOSTNET } from '../config';

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

 


  return (
    <div className="mobile-dashboard">
      <img src={beanImage} alt="Bean Avatar" className="mobile-bean-avatar" />

      <CollapsibleSection title="Wallet Info">
        <div className="mobile-section">
          <label>Address:</label>
          <div className="mobile-box">{walletInfo.address}</div>
        </div>
        <div className="mobile-section">
          <label>Balance:</label>
          <div className="mobile-balance">{walletInfo.balance ?? 'Loading...'}</div>
        </div>
        <div className="mobile-section">
          <label>Public Key:</label>
          <pre className="mobile-key">{walletInfo.publicKey}</pre>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title= "Addy QR">
        <div className="dashboard-section">
          <QRCode data={walletInfo.address} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title= "Navigate">
        <div className="mobile-actions">
          <button onClick={() => navigate('/dashboard/send')}>SEND BEAN</button>
          <button onClick={() => navigate('/dashboard/mint')}>MINT</button>
          <button onClick={() => navigate('/dashboard/tokens')}>MY TOKENS</button>
          <button onClick={() => navigate('/dashboard/txexplore')}>TRANSACTIONS</button>
          <button onClick={() => navigate('/dashboard/beanmojis')}>BEANMOJIS</button>
          <button onClick={() => navigate('/dashboard/myBeans')}>MY BEANMOJIS</button>
        </div>
      </CollapsibleSection>

      <Outlet />
    </div>
  );
};

export default MobileDashboard;

