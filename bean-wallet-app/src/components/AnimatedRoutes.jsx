import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './Home';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import TXExplore from './TXExplore';
import GenerateKeyPage from './GenerateKeyPage';
import BeanmojiGallery from './BeanmojiGallery';
import MyBeanmojis from './MyBeanMojis';
import ResponsiveTxForm from './ResponsiveTxForm';
import MobileDashboard from './MobileDashboard';
import MobileTransactionForm from './MobileTransactionForm';
import PageLayout from './PageLayout';
import UsernameLabelSetter from './UsernameLabelSetter';
import About from './About';


const AnimatedRoutes = ({ privateKey, walletInfo, handleLogin,  setNotifications, rehydrated}) => {
  const location = useLocation();
  const isLoggedIn = !!privateKey;

  return rehydrated ? (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageLayout><Home isLoggedIn={isLoggedIn} /></PageLayout>} />
      <Route path="/login" element={<PageLayout><LoginForm onLogin={handleLogin} /></PageLayout>} />
      <Route path="/generate-key" element={<PageLayout><GenerateKeyPage onLogin={handleLogin} /></PageLayout>} />
      <Route path="/beanmojis" element={<PageLayout><BeanmojiGallery walletAddress={walletInfo?.address} /></PageLayout>} />
      <Route path="/myBeans" element={<PageLayout><MyBeanmojis walletAddress={walletInfo?.address} /></PageLayout>} />
      <Route path="/about/:topic" element={<PageLayout><About walletAddress={walletInfo?.address} /></PageLayout>} />
      <Route
        path="/username"
        element={
          <PageLayout>
            <UsernameLabelSetter
              walletAddress={walletInfo?.address}
              privateKey={privateKey}
            />
          </PageLayout>
        }
      />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthed={!!privateKey} rehydrated={rehydrated}>
            <PageLayout>
              <Dashboard walletInfo={walletInfo} privateKey={privateKey} />
            </PageLayout>
          </ProtectedRoute>
        }
        >
          <Route index element={<ResponsiveTxForm privateKey={privateKey} walletInfo={walletInfo} />} />
          <Route path="send" element={<ResponsiveTxForm privateKey={privateKey} walletInfo={walletInfo} />} />
          <Route path="txexplore" element={<TXExplore walletInfo={walletInfo} />} />
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
          <Route path="myBeans" element={<MyBeanmojis walletAddress={walletInfo?.address} />} />  
        </Route>
      </Routes>
    </AnimatePresence>
  ) : (
    <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>
  );
};

export default AnimatedRoutes;
