import React from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IS_GHOSTNET } from '../config';




const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const beanImage = IS_GHOSTNET ? "/GhostBean.png" : "/WalletBean.png";

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
      
      

      {!isLoggedIn && (
        <>
          <h2>
            {IS_GHOSTNET
              ? 'Welcome to LimaBeanWallet (GhostNet)'
              : 'Welcome to LimaBeanWallet Beta'}
          </h2>
          <h4>
            powered by {IS_GHOSTNET ? 'GhostBeanChain' : 'BeanChain'}
          </h4>
          <p>{IS_GHOSTNET ? 'You are in testnet mode. Your BEAN is spooky, but not real.' : 'Login up top!'}</p>
          <p>{IS_GHOSTNET ? 'Scan a QR or generate a wallet below to explore GhostNet.' : 'or click below to get started!'}</p>
          <button onClick={() => navigate('/generate-key')}>
            {IS_GHOSTNET ? 'Create Ghost Wallet' : 'Generate New Wallet'}
          </button>
        </>
      )}

      {isLoggedIn && (
        <h2>If you are lost hit that "Dashboard" button up top!</h2>
      )}
    </motion.div>
  );
};

export default Home;
