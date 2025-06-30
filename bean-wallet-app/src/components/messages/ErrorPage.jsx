import React, { useEffect, useState } from 'react';
import './ErrorScreen.css';

const ErrorScreen = ({ errorMessage, onRetry }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300); // start animation after short delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="error-screen">
      <div className={`bean-wrapper ${animate ? 'slide-in' : ''}`}>
        <img src="/ErrorBean" alt="Sad Bean" className="error-bean" />
      </div>
      <div className={`error-text ${animate ? 'fade-in' : ''}`}>
        <h2>❌ Transaction Failed</h2>
        <p>{errorMessage || 'Something went wrong. Please try again.'}</p>
        <button onClick={onRetry}>Try Again</button>
      </div>
    </div>
  );
};

export default ErrorScreen;
