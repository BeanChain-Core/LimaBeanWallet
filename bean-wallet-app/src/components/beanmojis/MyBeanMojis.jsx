import React, { useEffect, useState } from 'react';
import './MyBeanMojis.css';


const MyBeanmojis = ({ walletAddress }) => {
  const [ownedBeans, setOwnedBeans] = useState([]);

  useEffect(() => {
    const loadOwned = async () => {
      try {
        const res = await fetch(`https://limabean.xyz/bean/collection/${walletAddress}`);
        const data = await res.json();
        setOwnedBeans(data);
      } catch (err) {
        console.error('Failed to load owned beanmojis:', err);
      }
    };
    if (walletAddress) loadOwned();
  }, [walletAddress]);

  const handleDownload = (beanName) => {
    const link = document.createElement('a');
    link.href = `/beanmoji-assets/${beanName}.png`;
    link.download = `${beanName}.png`;
    link.click();
  };

  return (
    <div className="my-beans page-main">
      <h2>My Beanmojis</h2>
      <div className="beanmoji-grid">
        {ownedBeans.map(name => (
          <div className="beanmoji-card" key={name}>
            <img src={`/beanmoji-assets/${name}.png`} alt={name} />
            <p className="beanmoji-name">{name}</p>
            <button onClick={() => handleDownload(name)}>⬇️ Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBeanmojis;
