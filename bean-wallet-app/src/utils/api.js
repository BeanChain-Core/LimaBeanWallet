function getActiveNode() {
  return 'https://limabean.xyz/api';
}



// 🔧 Universal GET or POST JSON fetch helper
async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const rawText = await res.text(); // get body even if content-type is off
      console.warn(`⚠️ Unexpected response type: ${contentType}, body:`, rawText);
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const data = await res.json();

    if (!res.ok || (data.status && data.status !== 'success')) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (err) {
    console.error(`❌ fetchJson error for ${url}:`, err);
    return null;
  }
}

// 📦 Fetch wallet balance
export async function fetchWalletBalance(address) {
  const data = await fetchJson(`${getActiveNode()}/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  return data?.balance ?? null;
}

// 🔐 Fetch wallet nonce
export async function fetchWalletNonce(address) {
  const data = await fetchJson(`${getActiveNode()}/nonce/${address}`);
  return data?.nonce ?? 0;
}

// 📤 Submit transaction
export async function submitTransaction(txHash, txObject) {
  const payload = {
    txHash: txHash, // ✅ Capital H
    transactionJson: JSON.stringify(txObject)
  };
  
  const response = await fetch(`${getActiveNode()}/submit-transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log(payload);
  return data;
}

export const fetchAllTxsForWallet = async (address) => {
  const [pending, confirmedSent, confirmedReceived, rejected] = await Promise.all([
    fetchPendingTxs(address),
    fetchConfirmedTxs(address),
    fetchReceivedTxs(address),
    fetchFailedTxs(address),
  ]);

  const combined = [
    ...pending.map(tx => ({ ...tx, status: 'pending' })),
    ...confirmedSent.map(tx => ({ ...tx, status: 'complete' })),
    ...confirmedReceived.map(tx => ({ ...tx, status: 'complete' })),
    ...rejected.map(tx => ({ ...tx, status: 'rejected' })),
  ];

  // Optional: deduplicate by txHash if needed
  const seen = new Set();
  return combined.filter(tx => {
    if (seen.has(tx.txHash)) return false;
    seen.add(tx.txHash);
    return true;
  });
}


export async function fetchPendingTxs(address) {
  const data = await fetchJson(`${getActiveNode()}/mempool/pending/${address}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchConfirmedTxs(address) {
  const data = await fetchJson(`${getActiveNode()}/txs/sent/${address}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchReceivedTxs(address) {
  const data = await fetchJson(`${getActiveNode()}/txs/received/${address}`);
  return Array.isArray(data) ? data : [];
}

export const fetchFailedTxs = async (walletAddress) => {
  const data = await fetchJson(`${getActiveNode()}/rejected/${walletAddress}`);
  if (!data) return [];

  const txList = Object.values(data).map((txStr, i) => {
    try {
      return JSON.parse(txStr);
    } catch (e) {
      console.warn(`⚠️ Failed to parse rejected TX #${i}:`, e, txStr);
      return null;
    }
  }).filter(tx => tx !== null);

  return txList;
};

export async function fetchMyTokens(address) {
  const data = await fetchJson(`${getActiveNode()}/layer2/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  console.log(address);
  console.log(data);

  return Array.isArray(data) ? data : [];
}

export async function fetchTxByHash(txHash) {
  try {
    const response = await fetch(`${getActiveNode()}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txHash }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }

    const data = await response.json();
    return typeof data === 'string' ? JSON.parse(data) : data; // 👈 because your backend returns raw JSON string
  } catch (err) {
    console.error('❌ fetchTxByHash error:', err);
    throw err;
  }
}

export async function fetchLayer2Nonce(address) {
  try {
      const response = await fetch('/api/layer2nonce', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ address })
      });
      const nonce = await response.json();
      return nonce;
  } catch (error) {
      console.error('❌ Failed to fetch Layer2 nonce:', error);
      return null;
  }
}













  