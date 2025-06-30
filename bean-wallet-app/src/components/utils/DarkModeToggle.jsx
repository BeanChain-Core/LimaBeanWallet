import React, { useEffect, useState } from 'react';
import { IS_GHOSTNET } from '../../config';

const DarkModeToggle = () => {
  const defaultTheme = localStorage.getItem('theme') || 'dark';
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const className = IS_GHOSTNET
      ? theme === 'light' ? 'ghostnet-theme-light' : 'ghostnet-theme-dark'
      : theme === 'light' ? 'light-theme' : 'dark-theme';

    document.documentElement.className = className;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="theme-toggle-wrapper">
      <button
        onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
        className="theme-toggle-btn"
      >
        {theme === 'light'
          ? <img src='/darkmode.png' width={60} alt="Switch to dark" />
          : <img src='/lightmode.png' width={60} alt="Switch to light" />}
      </button>
    </div>
  );
};

export default DarkModeToggle;
