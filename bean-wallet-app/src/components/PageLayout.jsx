import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import './PageLayout.css';

const PageLayout = ({
  children,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  onHomeClick,
  onDashboardClick,
  notifications,
  showNotifDropdown,
  setShowNotifDropdown,
}) => {
  return (
    <div className="page-wrapper">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
        onHomeClick={onHomeClick}
        onDashboardClick={onDashboardClick}
        notifications={notifications}
        showNotifDropdown={showNotifDropdown}
        setShowNotifDropdown={setShowNotifDropdown}
      />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;

  