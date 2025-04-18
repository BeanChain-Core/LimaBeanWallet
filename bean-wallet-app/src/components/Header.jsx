import React from 'react';
import './Header.css';
import DarkModeToggle from './DarkModeToggle';
import { IS_GHOSTNET } from '../config';

const Header = ({
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  onHomeClick,
  onDashboardClick,
}) => {
  return (
    <>
    <header className="header">
      <div className="logo" onClick={onHomeClick}>
        {IS_GHOSTNET
                      ? 'LimaBeanWallet (GHOSTNET)'
                      : 'LimaBeanWallet (BETA)'}
      </div>
      <div className="nav-buttons">
      <DarkModeToggle />
        {isLoggedIn && (
          <>
            <button onClick={onDashboardClick} className="dashboard-button">
              Dashboard
            </button>
          </>
        )}

        {isLoggedIn ? (
          <button onClick={onLogoutClick} className="logout-button">
            Log Out
          </button>
        ) : (
          <button onClick={onLoginClick} className="login-button">
            Go to Login
          </button>
        )}
      </div>
    </header>
    <div className="dev-disclaimer">
      ⚠️ This app is in early development/testing. Use with caution — data may be reset or changed!
    </div>
    </>

  );
};

export default Header;

