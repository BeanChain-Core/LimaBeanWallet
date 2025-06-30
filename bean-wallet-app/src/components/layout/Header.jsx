import React, { useState } from 'react';
import './Header.css';
import DarkModeToggle from '../utils/DarkModeToggle.jsx';
import { IS_GHOSTNET } from '../../config';
import SmartSearchBar from '../utils/SmartSearchBar.jsx';

const Header = ({
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  onHomeClick,
  onDashboardClick,
}) => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <>
      <header className="header">
        <div className="logo" onClick={onHomeClick}>
          {IS_GHOSTNET
            ? 'LimaBeanWallet (GHOSTNET)'
            : 'LimaBeanWallet (BETA)'}
        </div>
        <div className="nav-buttons">
          <DarkModeToggle showGhostToggle={false} />
          {isLoggedIn && (
            <button onClick={onDashboardClick} className="dashboard-button">
              Dashboard
            </button>
          )}
          {isLoggedIn && (
            <button onClick={onLogoutClick} className="logout-button">
              Log Out
            </button>
          )}
        </div>
      </header>

      <SmartSearchBar />

      {showDisclaimer && (
        <div className="dev-disclaimer">
          ⚠️ This app is in early development/testing. Use with caution — data may be reset or changed!{' '}
          <span
            className="disclaimer-dismiss"
            onClick={() => setShowDisclaimer(false)}
          >
            [I understand — click to hide]
          </span>
        </div>
      )}
    </>
  );
};

export default Header;


