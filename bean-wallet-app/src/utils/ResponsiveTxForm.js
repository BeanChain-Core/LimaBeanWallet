import React from 'react';
import TransactionForm from './TransactionForm';
import MobileTransactionForm from './MobileTransactionForm'; // Make sure this exists and handles the same props

const isMobile = () => {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
};

const ResponsiveTxForm = (props) => {
  return isMobile() ? (
    <MobileTransactionForm {...props} />
  ) : (
    <TransactionForm {...props} />
  );
};

export default ResponsiveTxForm;
