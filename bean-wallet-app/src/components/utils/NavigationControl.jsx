import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationControl.css';

export default function NavigationControls() {
  const navigate = useNavigate();

  return (
    <div className="navigation-controls">
      <button onClick={() => navigate(-1)} className="nav-btn" title="Back">
        ◀ Back
      </button>
      <button onClick={() => navigate(1)} className="nav-btn" title="Forward">
        Forward ▶
      </button>
    </div>
  );
}