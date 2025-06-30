import React from 'react';
import { Link } from 'react-router-dom';
import './MetaDisplay.css';

export default function MetaDisplay({ meta }) {
  if (!meta || typeof meta === 'string') {
    return <pre>{meta || 'No metadata'}</pre>;
  }

  return (
    <div className="meta-display">
      {Object.entries(meta).map(([key, value]) => (
        <div key={key} className="meta-line">
          <span className="meta-label">{formatKey(key)}:</span>
          <span className="meta-value">
            {key === 'tokenHash' ? (
              <Link to={`/token/${value}`} className="token-link">
                {formatValue(value)}
              </Link>
            ) : (
              formatValue(value)
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

function formatValue(val) {
  if (typeof val === 'string' && val.length > 20) {
    return val.slice(0, 8) + '...' + val.slice(-6);
  }
  if (typeof val === 'number') {
    return val.toLocaleString();
  }
  return String(val);
}