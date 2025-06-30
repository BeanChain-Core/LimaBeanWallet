import React from 'react';
import useIsMobile from './hooks/useIsMobile';
import TransactionForm from './TransactionForm';
import MobileTransactionForm from './mobile/MobileTransactionForm';
import LoadingBean from './messages/LoadingBean'; // 👈 You'll create this component

const ResponsiveTxForm = ({ privateKey, walletInfo }) => {
  const isMobile = useIsMobile();

  const isReady = isMobile !== undefined && privateKey && walletInfo;

  if (!isReady) return <LoadingBean />; // ⏳ Show animated loader

  return isMobile ? (
    <MobileTransactionForm privateKey={privateKey} walletInfo={walletInfo} />
  ) : (
    <TransactionForm privateKey={privateKey} walletInfo={walletInfo} />
  );
};

export default ResponsiveTxForm;


