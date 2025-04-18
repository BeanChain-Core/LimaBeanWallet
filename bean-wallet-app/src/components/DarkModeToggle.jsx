import React, { useEffect, useState } from 'react';
import { IS_GHOSTNET } from '../config';

const DarkModeToggle = () => {
  const defaultTheme = localStorage.getItem('theme') || 'dark';
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    let className;

    if (IS_GHOSTNET) {
      className = theme === 'light' ? 'ghostnet-theme-light' : 'ghostnet-theme-dark';
    } else {
      className = theme === 'light' ? 'light-theme' : 'dark-theme';
    }

    document.documentElement.className = className;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default DarkModeToggle;
