// src/components/MobileDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import './MobileDashboard.css';
import { Outlet } from 'react-router-dom';
import QRCode from './QRCode';
import { IS_GHOSTNET } from '../config';




const MobileDashboard = ({ walletInfo, privateKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const beanImage = IS_GHOSTNET ? "/GhostBean.png" : "/WalletBean.png";

 


  return (
    <div className="mobile-dashboard">
      <img src={beanImage} alt="Bean Avatar" className="mobile-bean-avatar" />


      <div className="mobile-section">
        <label>Address:</label>
        <div className="mobile-box">{walletInfo.address}</div>
      </div>

      <div className="dashboard-section">
          <label>Receive QR:</label>
          <QRCode data={walletInfo.address} />
      </div>

      <div className="mobile-section">
        <label>Balance:</label>
        <div className="mobile-balance">{walletInfo.balance ?? 'Loading...'}</div>
      </div>

      <div className="mobile-section">
        <label>Public Key:</label>
        <pre className="mobile-key">{walletInfo.publicKey}</pre>
      </div>

      <div className="mobile-actions">
        <button onClick={() => navigate('/mobile/send')}>Send BEAN</button>
        <button onClick={() => navigate('/mobile/txexplore')}>My Transactions</button>
        <button onClick={() => navigate('/beanmojis')}>BeanMojis</button>
        <button onClick={() => navigate('/myBeans')}>My BeanMoji Collection</button>
      </div>
      <Outlet />
    </div>
  );
};

export default MobileDashboard;

