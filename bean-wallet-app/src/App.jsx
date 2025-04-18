import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { generateAddress, generatePublicKey } from './utils/walletUtils';
import { fetchWalletBalance } from './utils/api';
import AnimatedRoutes from './components/AnimatedRoutes';
import './components/Main.css';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';
import { IS_GHOSTNET } from './config';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [privateKey, setPrivateKey] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [rehydrated, setRehydrated] = useState(false);

  const navigate = useNavigate();


  


  const handleLogin = async (privateKeyHex, justCreated = false) => {
    const publicKey = await generatePublicKey(privateKeyHex);
    const address = generateAddress(publicKey);
    const balance = await fetchWalletBalance(address);
  
    setPrivateKey(privateKeyHex);
    setWalletInfo({ publicKey, address, balance });
    sessionStorage.setItem('privateKey', privateKeyHex);
  
    if (location.pathname === '/login' || location.pathname === '/generate-key') {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('privateKey');
    setPrivateKey(null);
    setWalletInfo(null);
    navigate('/');
  };


  const location = useLocation();

  useEffect(() => {
    const savedKey = sessionStorage.getItem('privateKey');
    const rehydrate = async () => {
      if (savedKey) {
        await handleLogin(savedKey); 
      }
      setRehydrated(true); 
    };
  
    rehydrate();
  }, []);

  useEffect(() => {
    if (IS_GHOSTNET) {
      document.documentElement.classList.add('ghostnet-theme');
    } else {
      document.documentElement.classList.remove('ghostnet-theme');
    }
  }, []);

  return (
    <div className="App">
      <Header
        isLoggedIn={!!privateKey}
        onLoginClick={() => navigate('/login')}
        onLogoutClick={handleLogout}
        onHomeClick={() => navigate('/')}
        onDashboardClick={() => navigate('/dashboard')}
        notifications={notifications}
        showNotifDropdown={showNotifDropdown}
        setShowNotifDropdown={setShowNotifDropdown}
      />
      


    <main className="main">
      <AnimatedRoutes
        privateKey={privateKey}
        walletInfo={walletInfo}
        handleLogin={handleLogin}
        notifications={notifications}
        setNotifications={setNotifications}
        rehydrated={rehydrated}
      />
    </main>
    
    

    </div>
  );
}

export default AppWrapper;





