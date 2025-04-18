import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './PageLayout.css';

const PageLayout = ({ children }) => {
  return (
    <div className="page-wrapper">
      <main className="page-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;

  