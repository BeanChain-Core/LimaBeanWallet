// components/SuccessScreen.jsx
import React from 'react';
import './SuccessScreen.css';

const SuccessScreen = ({txHash, amount, to}) => {
  return (
    <div className="success-wrapper">
      <img src="/SucessBean.png" alt="Success Bean" className="bean-slide" />
      <h2 className="success-message">🎉 Transaction Sent!</h2>
      <p><strong>Amount Sent:</strong> {amount} BEAN</p>
      <p><strong>Recipient:</strong> {to}</p>
      <p><strong>Transaction Hash:</strong> <code>{txHash}</code></p>
    </div>
  );
};

export default SuccessScreen;
