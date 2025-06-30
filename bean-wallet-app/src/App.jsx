import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import { generateAddress, generatePublicKey } from './utils/walletUtils';
import { fetchWalletBalance } from './utils/api';
import AnimatedRoutes from './components/utils/AnimatedRoutes';
import './components/Main.css';
import Footer from './components/layout/Footer';
import { useLocation } from 'react-router-dom';
import { isGhostNet } from './config';
import SmartSearchBar from './components/utils/SmartSearchBar';
import NavigationControls from './components/utils/NavigationControl';

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
  
    if (location.pathname === '/' || location.pathname === '/generate-key') {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('privateKey');
    setPrivateKey(null);
    setWalletInfo(null);

    // Wait until state updates before navigating
    setTimeout(() => {
      navigate('/');
    }, 0); // Give React a tick to update
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
    if (isGhostNet) {
      document.documentElement.classList.add('ghostnet-theme');
    } else {
      document.documentElement.classList.remove('ghostnet-theme');
    }
  }, []);

  return (
    <div className="App">
      {/* <Header
        isLoggedIn={!!privateKey}
        onLoginClick={() => navigate('/')}
        onLogoutClick={handleLogout}
        onHomeClick={() => navigate('/')}
        onDashboardClick={() => navigate('/dashboard')}
        notifications={notifications}
        showNotifDropdown={showNotifDropdown}
        setShowNotifDropdown={setShowNotifDropdown}
      /> */}
      


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
    
    
    <NavigationControls/>
    </div>
  );
}

export default AppWrapper;





