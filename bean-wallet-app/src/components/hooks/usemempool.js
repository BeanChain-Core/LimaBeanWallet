import { useEffect, useState } from 'react';
import { fetchMempool } from '../../utils/api';

const useMempool = (refreshInterval = 5000) => {
  const [txs, setTxs] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMempool();
        setTxs(data);
      } catch (e) {
        console.error('Mempool fetch error:', e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return txs;
};
export default useMempool;