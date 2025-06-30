import React from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './utils/DarkModeToggle';
import { isGhostNet } from '../config';

import WalletImportInline from './toolpages/WalletImportInline';




const Home = ({ isLoggedIn, onLogin }) => {
  const navigate = useNavigate();
  const beanImage = isGhostNet ? "/GhostBean.png" : "/WalletBean.png";

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <img src={beanImage} className='spinning-logo' alt="logo" />
      <div className="bean-rain">
        {[...Array(12)].map((_, i) => (
          <img key={i} src={beanImage} alt="bean" className="falling-bean" style={{ left: `${Math.random() * 100}%`, animationDelay: `${i * 1.5}s` }} />
        ))}
      </div>
      
      

      {!isLoggedIn ? (
        <div className="home-welcome-card">
          <h2>
            {isGhostNet
              ? 'Welcome to LimaBeanWallet (GhostNet)'
              : 'Welcome to LimaBeanWallet Beta'}
          </h2>
          <h4 className="powered-text">
            powered by {isGhostNet ? 'GhostBeanChain' : 'BeanChain'}
          </h4>

          <p className="home-description">
            {isGhostNet
              ? 'We are still in TestNet but this is what the GhostNet theme will look like. Your BEAN is spooky, but not real.'
              : 'We are still in TestNet but this is what the MainNet theme will look like.'}
          </p>

          <p className="home-description">
            {isGhostNet
              ? 'Generate a wallet below to explore GhostNet.'
              : 'or click below to get started!'}
          </p>

          <div className="home-button-section">
            <button onClick={() => navigate('/generate-key')}>
              {isGhostNet ? 'Create Ghost Wallet' : 'Generate New Wallet'}
            </button>
          </div>

          <p className="home-or-text">or import an existing wallet:</p>
          <WalletImportInline onLogin={onLogin} />
        </div>
      ) : (
        <h2>If you are lost hit that "Dashboard" button up top!</h2>
      )}
      {/* <div className='toggle'><DarkModeToggle showLightDark={false}/></div> */}
      
    </motion.div>
  );
};

export default Home;
