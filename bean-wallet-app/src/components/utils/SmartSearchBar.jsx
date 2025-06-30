import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SmartSearchBar.css';

export default function SmartSearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const input = query.trim();
    if (!input) return;

    setLoading(true);
    try {
      if (/^(0x)?[a-fA-F0-9]{64}$/.test(input)) {
        const cleanHash = input.startsWith('0x') ? input.slice(2) : input;
        navigate(`/tx/${cleanHash}`);
        return;
      }

      if (
        /^0x[a-fA-F0-9]{40}$/.test(input) ||
        /^BEANX:0x[a-fA-F0-9]{40}$/.test(input)
      ) {
        navigate(`/wallet/${input}`);
        return;
      }

      alert('❌ Not a valid wallet address or transaction hash.');
    } catch (err) {
      console.error('SmartSearch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-banner-container">
      <form className="search-banner-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-banner-input"
          placeholder="Search wallet address or transaction hash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="search-banner-button"
          disabled={loading}
          title="Search"
        >
          SEARCH
        </button>
      </form>
    </div>
  );
}