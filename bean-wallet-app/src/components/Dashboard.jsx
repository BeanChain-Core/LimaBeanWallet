import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Dashboard.css';
import useIsMobile from './hooks/useIsMobile';
import MobileDashboard from './MobileDashboard';
import QRCode from './QRCode';
import { IS_GHOSTNET } from '../config';


const Dashboard = ({ privateKey, walletInfo }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const beanImage = IS_GHOSTNET ? "/GhostBean.png" : "/WalletBean.png";
 
  
  

  //logs
  console.log('walletInfo:', walletInfo);
  console.log('isMobile:', isMobile);


  if (!walletInfo) return null; // Prevent errors if walletInfo isn't ready ** ADD LOADING ANIMATION ??

  // Show loading spinner until we know if it's mobile or not
  if (isMobile === undefined || !walletInfo) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading your Bean Wallet...</p>
      </div>
    );
  }

  // Render mobile dashboard
  if (isMobile) {
    return <MobileDashboard walletInfo={walletInfo} privateKey={privateKey} />;
  }
  

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="dashboard-glow" />

      {/* Wallet Panel */}
      <div className="dashboard-wallet-panel">
      
        <img src={beanImage} alt="Bean Avatar" className="bean-avatar" />


        <div className="dashboard-section">
          <label>Wallet Address:</label>
          <div className="address-box">{walletInfo.address}</div>
        </div>

        <div className="dashboard-section">
          <label>Receive QR:</label>
          <QRCode data={walletInfo.address} />
        </div>

        <div className="dashboard-section balance">
          <label>Balance:</label>
          <div className="balance-number">
            {walletInfo.balance ?? 'Loading...'}
          </div>
        </div>

        <div className="dashboard-section">
          <label>Public Key:</label>
          <pre className="public-key">{walletInfo.publicKey}</pre>
        </div>

        <div className="dashboard-actions">
          <button onClick={() => navigate('/dashboard/send')}>New Transaction</button>
          <button onClick={() => navigate('/dashboard/txexplore')}>My Transactions</button>
          <button onClick={() => navigate('/dashboard/beanmojis')}>BeanMojis</button>
          <button onClick={() => navigate('/dashboard/myBeans')}>My BeanMoji Collection</button>
          <button onClick={() => navigate('/dashboard/mint')}>Mint</button>
          <button onClick={() => navigate('/dashboard/tokens')}>My Tokens</button>
        </div>
      </div>

      {/* Dynamic Page Content */}
      <div className="dashboard-content-panel">
        <Outlet />
      </div>
    </motion.div>
  );
};

export default Dashboard;


