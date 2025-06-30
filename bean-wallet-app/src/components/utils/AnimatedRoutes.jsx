import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Home from '../Home';
import LoginForm from '../toolpages/LoginForm';
import Dashboard from '../dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import TXExplore from '../dashboard/TXExplore';
import GenerateKeyPage from '../toolpages/GenerateKeyPage';
import BeanmojiGallery from '../beanmojis/BeanmojiGallery';
import MyBeanmojis from '../beanmojis/MyBeanMojis';
import ResponsiveTxForm from '../ResponsiveTxForm';
import MobileDashboard from '../mobile/MobileDashboard';
import MobileTransactionForm from '../mobile/MobileTransactionForm';
import PageLayout from '../PageLayout';
import About from '../docs/About';
import TokenMintForm from '../../components/tokenforms/TokenMintForm';
import MyTokens from '../dashboard/MyTokens';
import TXDetails from '../detailCards/TXDetails';
import TokenPage from '../detailCards/TokenPage';
import SendTokenForm from '../../components/tokenforms/SendTokenForm';
import BurnTokenForm from '../../components/tokenforms/BurnTokenForm';
import WalletViewer from '../explorerLite/WalletViewer';
import MempoolViewer from '../MempoolViewer';


const AnimatedRoutes = ({
    privateKey,
    walletInfo,
    handleLogin,
    notifications,
    showNotifDropdown,
    setNotifications,
    setShowNotifDropdown,
    rehydrated
  }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!privateKey;
  const sharedLayoutProps = {
    isLoggedIn,
    onLoginClick: () => navigate('/'),
    onLogoutClick: () => {
      sessionStorage.removeItem('privateKey');
      setNotifications([]);
      window.location.href = '/'; // clean reset
    },
    onHomeClick: () => navigate('/'),
    onDashboardClick: () => navigate('/dashboard'),
    notifications,
    showNotifDropdown,
    setShowNotifDropdown,
  };

  return rehydrated ? (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageLayout {...sharedLayoutProps}><Home isLoggedIn={isLoggedIn} onLogin={handleLogin} /></PageLayout>} />
      <Route path="/login" element={<PageLayout {...sharedLayoutProps}><LoginForm onLogin={handleLogin} /></PageLayout>} />
      <Route path="/generate-key" element={<PageLayout {...sharedLayoutProps}><GenerateKeyPage onLogin={handleLogin} /></PageLayout>} />
      <Route path="/beanmojis" element={<PageLayout {...sharedLayoutProps}><BeanmojiGallery walletAddress={walletInfo?.address} /></PageLayout>} />
      <Route path="/beanmojis/myBeans" element={<PageLayout {...sharedLayoutProps}><MyBeanmojis walletAddress={walletInfo?.address} /></PageLayout>} />
      <Route path="/about/" element={<PageLayout {...sharedLayoutProps}><About walletAddress={walletInfo?.address} /></PageLayout>} />
      <Route path="/about/:topic" element={<PageLayout {...sharedLayoutProps}><About walletAddress={walletInfo?.address} /></PageLayout>} />
      <Route path="/mint" element={<PageLayout {...sharedLayoutProps}><TokenMintForm privateKey={privateKey} walletInfo={walletInfo} /></PageLayout>} />
      <Route path="/tokens" element={<PageLayout {...sharedLayoutProps}><MyTokens walletInfo={walletInfo} /></PageLayout>} />
      <Route path="/tx/:txHash" element={<PageLayout {...sharedLayoutProps}><TXDetails /> </PageLayout>} />
      <Route path="/wallet/:address" element={<PageLayout {...sharedLayoutProps}><WalletViewer /> </PageLayout>} />
      
      
      <Route path="/token/:tokenHash" element={<PageLayout {...sharedLayoutProps}><TokenPage walletInfo={walletInfo} privateKey={privateKey}/> </PageLayout>} />
      <Route path="/send-token/:tokenHash" element={<PageLayout {...sharedLayoutProps}><SendTokenForm walletInfo={walletInfo} privateKey={privateKey} /></PageLayout>} />

      <Route path="/mempool" element={<PageLayout {...sharedLayoutProps}><MempoolViewer /></PageLayout>} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthed={!!privateKey} rehydrated={rehydrated}>
            <PageLayout {...sharedLayoutProps}>
              <Dashboard walletInfo={walletInfo} privateKey={privateKey} />
            </PageLayout>
          </ProtectedRoute>
        }
        >
          <Route index element={<ResponsiveTxForm privateKey={privateKey} walletInfo={walletInfo} />} />
          <Route path="send" element={<ResponsiveTxForm privateKey={privateKey} walletInfo={walletInfo} />} />
          <Route path="txexplore" element={<TXExplore walletInfo={walletInfo} />} />
          <Route path="mint" element={<TokenMintForm privateKey={privateKey} walletInfo={walletInfo} />} />
          <Route path="tokens" element={<MyTokens walletInfo={walletInfo} />} />
          <Route path="tx/:txHash" element={<TXDetails />} />
          <Route path="token/:tokenHash" element={<TokenPage walletInfo={walletInfo} privateKey={privateKey}/> } />

          <Route path="send-token/:tokenHash" element={<SendTokenForm walletInfo={walletInfo} privateKey={privateKey} />} />
          <Route path="burn-token/:tokenHash" element={<BurnTokenForm walletInfo={walletInfo} privateKey={privateKey} />} />
        </Route>
        <Route
          path="/mobile"
          element={
            <ProtectedRoute isAuthed={!!privateKey} rehydrated={rehydrated}>
              <PageLayout>
                <MobileDashboard walletInfo={walletInfo} privateKey={privateKey} />
              </PageLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<p style={{ textAlign: 'center' }}>Select an action above 👆</p>} />
          <Route path="send" element={<MobileTransactionForm walletInfo={walletInfo} privateKey={privateKey} />} />
          <Route path="txexplore" element={<TXExplore walletInfo={walletInfo} />} />
          <Route path="mint" element={<TokenMintForm privateKey={privateKey} walletInfo={walletInfo} />} />
          <Route path="tokens" element={<MyTokens walletInfo={walletInfo} />} />
          <Route path="tx/:txHash" element={<TXDetails />} />

          <Route path="token/:tokenHash" element={<TokenPage walletInfo={walletInfo} privateKey={privateKey}/> } />
          <Route path="send-token/:tokenHash" element={<SendTokenForm walletInfo={walletInfo} privateKey={privateKey} />} />
        </Route>
      </Routes>
    </AnimatePresence>
  ) : (
    <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>
  );
};

export default AnimatedRoutes;
