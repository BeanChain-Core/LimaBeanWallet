import React from 'react';
import './BeanError.css';

const BeanError = ({ message }) => {
  return (
    <div className="bean-error-container">
      <img src="/ErrorBean.png" alt="X Bean" className="bean-error-img" />
      <h2>Something went wrong!</h2>
      <p>{message || 'Could not load your transactions. Please try again later.'}</p>
    </div>
  );
};

export default BeanError;
