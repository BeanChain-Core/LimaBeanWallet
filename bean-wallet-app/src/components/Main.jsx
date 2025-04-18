import React from 'react';
import './Main.css';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import { motion } from 'framer-motion';

import Home from './Home';

const Main = ({ privateKey, showLogin, onLogin, walletInfo }) => {
  return (
    <motion.div
      className="main"
      key={privateKey ? 'dashboard' : showLogin ? 'login' : 'home'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      {privateKey ? (
        <Dashboard privateKey={privateKey} walletInfo={walletInfo} />
      ) : showLogin ? (
        <LoginForm onLogin={onLogin} />
      ) : (
        <Home/>
      )}
    </motion.div>
  );
};

export default Main;


