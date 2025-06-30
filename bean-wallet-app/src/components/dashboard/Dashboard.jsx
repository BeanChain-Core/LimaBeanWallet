import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Dashboard.css';
import useIsMobile from '../hooks/useIsMobile';
import MobileDashboard from '../mobile/MobileDashboard';
import QRCode from '../utils/QRCode';
import { IS_GHOSTNET } from '../../config';
import { fetchWalletBalance } from '../../utils/api'; 
import FaucetDripButton from '../utils/FaucetDripButton';
import axios from "axios";


const Dashboard = ({ privateKey, walletInfo: initialWalletInfo }) => {
  const [showQR, setShowQR] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const beanImage = IS_GHOSTNET ? "/GhostBean.png" : "/WalletBean.png";

  const [walletInfo, setWalletInfo] = useState(initialWalletInfo);

  
  useEffect(() => {
    const refreshBalance = async () => {
      if (!walletInfo?.address) return;
      try {
        const balance = await fetchWalletBalance(walletInfo.address); 
        setWalletInfo(prev => ({
          ...prev,
          balance: balance
        }));
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      }
    };

    const interval = setInterval(refreshBalance, 10000); // every 10 seconds
    refreshBalance(); 

    return () => clearInterval(interval); 
  }, [walletInfo?.address]);

  if (!walletInfo) return null;

  if (isMobile === undefined || !walletInfo) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading your Bean Wallet...</p>
      </div>
    );
  }

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
  
      <div className="dashboard-wallet-panel">
        <img src={beanImage} alt="Bean Avatar" className="bean-avatar" />
  
        <div className="dashboard-section">
          <label>Wallet Address:</label>
          <div className="address-box">{walletInfo.address}</div>
        </div>
  
        <div className="dashboard-section">
          <label
            onClick={() => setShowQR(prev => !prev)}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            {showQR ? 'Hide QR Code' : 'Click Here To Show Wallet QR Code'}
          </label>
          {showQR && (
            <div className="qr-wrapper">
              <QRCode data={walletInfo.address} />
            </div>
          )}
        </div>
  
        <div className="dashboard-section balance">
          <label>BEAN BALANCE:</label>
          <div className="balance-number">
            {walletInfo.balance ?? 'Loading...'}
          </div>
        </div>

        <div className="dashboard-section send-action">
          <button onClick={() => navigate('/dashboard/send')}>SEND BEAN</button>
        </div>

  
        <div className="dashboard-section">
          <label>Public Key:</label>
          <pre className="public-key">{walletInfo.publicKey}</pre>
        </div>

        <div className="dashboard-section send-action">
          <FaucetDripButton address={walletInfo?.address} />
        </div>

      </div>

      
  
      <div className="dashboard-content-panel">
        <div className="dashboard-top-nav">
          <button onClick={() => navigate('/dashboard/mint')}>MINT</button>
          <button onClick={() => navigate('/dashboard/tokens')}>MY TOKENS</button>
          <button onClick={() => navigate('/dashboard/txexplore')}>TRANSACTIONS</button>
          {/* <button onClick={() => navigate('/dashboard/beanmojis')}>BEANMOJIS</button>
          <button onClick={() => navigate('/dashboard/myBeans')}>MY BEANMOJIS</button> */}
        </div>
        <Outlet />
      </div>
    </motion.div>
  );
};

export default Dashboard;



