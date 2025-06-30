import React from 'react';
import './LoadingBean.css';
import beanLogo from '../../WalletBean.png'; // Adjust path if needed

const LoadingBean = () => {
  return (
    <div className="loading-container">
      <img src={beanLogo} alt="Loading..." className="loading-bean" />
      <p className="loading-text">Currently Beaning Your Beans...</p>
      <div className="bean-progress-bar">
        <div className="bean-progress-fill"></div>
      </div>
    </div>
  );
};

export default LoadingBean;

