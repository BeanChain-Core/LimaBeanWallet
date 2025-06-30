import React, { useState } from 'react';
import axios from 'axios';
import './FaucetDripButton.css';

const FaucetDripButton = ({ address }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDrip = async () => {
    if (!address) {
      setStatus({ type: 'error', message: 'Wallet address not loaded.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await axios.get(`https://gpn.beanchain.io/rn/faucet/drip/${address}`);

      if (res.data?.status === 'success') {
        setStatus({ type: 'success', message: 'Faucet drip submitted!' });
      } else {
        setStatus({
          type: 'error',
          message: res.data?.message || 'Faucet request failed.',
        });
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Unable to connect to faucet.';
      setStatus({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };


 return (
    <div className="faucet-wrapper">
      <button onClick={handleDrip} disabled={loading}>
        {loading ? 'Requesting...' : 'FAUCET DRIP'}
      </button>

      {status && (
        <p className={`status-msg ${status.type}`}>{status.message}</p>
      )}

      <p className="faucet-subtext">
        <a href="/about/faucet">
          What’s a Faucet Drip?
        </a>
      </p>
    </div>
  );
};

export default FaucetDripButton;
