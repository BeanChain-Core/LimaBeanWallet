import React, { useEffect, useState } from 'react';
import './BeanmojiGallery.css';

const BeanmojiGallery = ({ walletAddress }) => {
  const [beanmojis, setBeanmojis] = useState([]);
  const [ownedBeans, setOwnedBeans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all free beanmojis (from backend catalog)
  useEffect(() => {
    const loadFreeBeans = async () => {
      try {
        const res = await fetch('https://limabean.xyz/bean/all');
        const allBeans = await res.json();
        const freeBeans = allBeans.filter(bean => bean.isFree);
        setBeanmojis(freeBeans);
      } catch (err) {
        console.error('Failed to load beanmojis:', err);
      }
    };

    loadFreeBeans();
  }, []);

  // Fetch user's owned beans
  useEffect(() => {
    const loadOwnedBeans = async () => {
      try {
        if (!walletAddress) return;
        const res = await fetch(`https://limabean.xyz/bean/collection/${walletAddress}`);
        const userBeans = await res.json();
        setOwnedBeans(userBeans);
      } catch (err) {
        console.error('Failed to load user\'s beanmojis:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOwnedBeans();
  }, [walletAddress]);

  // Add a free beanmoji to collection
  const handleAdd = async (beanName) => {
    try {
      const res = await fetch('https://limabean.xyz/bean/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: walletAddress, beanName })
      });
      if (res.ok) {
        setOwnedBeans(prev => [...prev, beanName]);
      }
    } catch (err) {
      console.error('Failed to claim beanmoji:', err);
    }
  };

  if (loading) return <p>Loading your beanmoji collection...</p>;

  return (
    <div className="beanmoji-gallery page-main">
      <h2>Free Beanmojis</h2>
      <p>Add Beanmojis to your personal colection, and download them to use anywhere from the MyBeanmojis tab!</p>
      <p>THESE ARE NOT NFTs OR ON CHAIN ASSETS</p>
      <div className="beanmoji-grid">
        {beanmojis.map(({ name }) => (
          <div className="beanmoji-card" key={name}>
            <img src={`https://limabean.xyz/beanmoji-assets/${name}.png`} alt={name} />
            <p>{name}</p>
            {ownedBeans.includes(name) ? (
              <button className="owned" disabled>✔️ Owned</button>
            ) : (
              <button onClick={() => handleAdd(name)}>➕ Add</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeanmojiGallery;
