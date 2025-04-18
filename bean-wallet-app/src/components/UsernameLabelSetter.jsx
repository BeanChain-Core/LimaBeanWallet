import React, { useState } from 'react';
import { signLabelUpdate } from '../utils/signLabelMessage';
import './UsernameLabelSetter.css';

const UsernameLabelSetter = ({ walletAddress, privateKey }) => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetLabel = async () => {
    if (!username || username.length < 3) {
      setStatus("❌ Username must be at least 3 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setStatus("❌ Only letters, numbers, and underscores are allowed.");
      return;
    }

    const label = `WUN:${username}`;
    try {
      setLoading(true);
      setStatus('');
      const signedData = await signLabelUpdate(privateKey, walletAddress, label);

      const res = await fetch('https://limabean.xyz/api/label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signedData),
      });

      if (res.ok) {
        setStatus('✅ Username saved successfully!');
      } else {
        const error = await res.text();
        setStatus(`❌ Failed to save: ${error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress || !privateKey) {
    return (
      <div className="username-warning">
        ⚠️ Wallet not loaded. Please sign in.
      </div>
    );
  }

  return (
    <div className="username-container">
      <h2 className="username-title">Set Your Username</h2>
      <p className="username-info">
        Usernames are <strong>not unique</strong>, so try making yours more creative to help others find you.
      </p>

      <input
        type="text"
        className="username-input"
        placeholder="e.g., cryptobean_42"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleSetLabel}
        className="username-button"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Username'}
      </button>

      {status && (
        <p className={`username-status ${status.startsWith('✅') ? 'success' : 'error'}`}>
          {status}
        </p>
      )}
    </div>
  );
};

export default UsernameLabelSetter;


