import React from 'react';
import './Footer.css';
import { IS_GHOSTNET } from '../../config';

const Footer = () => {
  const activeNode = 'https://limabean.xyz/api';
  const beanImage = IS_GHOSTNET ? "/GhostBean.png" : "/WalletBean.png";

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Chain Links</h4>
          <ul>
            <li><a href="https://beanchain.io" target="_blank" rel="noopener noreferrer">BeanChain.io</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community & Info</h4>
          <ul>
            <li><a href="/about/:default">About LimaBean</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Node Connection</h4>
          <p className="active-node-label">
            Connected to: <strong>LimaBean Node</strong>
          </p>
        </div>

        <img src={beanImage} alt="Footer Bean" className="footer-bean" />
      </div>

      <p className="footer-bottom-text">
        © {new Date().getFullYear()} LimaBean Wallet | Powered by BeanChain
      </p>
    </footer>
  );
};

export default Footer;
