import React from 'react';
import './SuccessScreen.css';

const SuccessScreen = ({ txHash, amount, to, tokenName = 'BEAN', type = 'send', status = 'success' }) => {
  const getMessage = () => {
    if (status === 'error') return 'Transaction Failed';
    if (status === 'pending') return 'Transaction Pending';
    switch (type) {
      case 'mint': return `${tokenName} Minted`;
      case 'burn': return `${tokenName} Burned`;
      case 'token': return `${tokenName} Sent`;
      case 'send': return 'Transaction Sent';
      default: return 'Action Complete';
    }
  };

  const getImage = () => {
    if (status === 'error') return '/ErrorBean.png';
    return '/SucessBean.png';
  };

  return (
    <div className="success-wrapper">
      <img src={getImage()} alt="Result Bean" className="bean-slide" />
      <h2 className="success-message">{getMessage()}</h2>
      {amount && <p><strong>Amount:</strong> {amount} {tokenName}</p>}
      {to && <p><strong>Recipient:</strong> {to}</p>}
      {txHash && <p><strong>Transaction Hash:</strong> <code>{txHash}</code></p>}
    </div>
  );
};

export default SuccessScreen;
