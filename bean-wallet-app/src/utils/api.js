function getActiveNode() {
  return 'https://limabean.xyz/api';
  //return 'http://localhost:8080/api';
}



// 🔧 Universal GET or POST JSON fetch helper
async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const rawText = await res.text();

    if (!res.ok) {
      throw new Error(`Request failed: ${rawText}`);
    }

    if (contentType.includes('application/json') || contentType.includes('text/plain')) {
      return JSON.parse(rawText);
    }

    throw new Error(`Unsupported content-type: ${contentType}`);
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
      const response = await fetch(`${getActiveNode()}/layer2nonce`, {
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


export async function fetchTokenDetails(tokenHash) {
  const data = await fetchJson(`${getActiveNode()}/token-details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenHash }),
  });

  return data ?? null;
}

export async function fetchMempool() {
  const data = await fetchJson(`${getActiveNode()}/mempool`);
  console.log("📦 Raw mempool data:", data);

  if (!data || typeof data !== 'object') return [];

  const parsed = Object.values(data).map((txStr, i) => {
    try {
      return JSON.parse(txStr);
    } catch (e) {
      console.warn(`⚠️ Failed to parse mempool TX #${i}:`, e, txStr);
      return null;
    }
  }).filter(Boolean);

  console.log("✅ Parsed mempool:", parsed);
  return parsed;
}

export async function fetchAllTokens() {
  const data = await fetchJson(`${getActiveNode()}/tokens/all`);
  return Array.isArray(data) ? data : [];
}

export async function fetchRejectedTxByHash(hash) {
  const data = await fetchJson(`${getActiveNode()}/rejected/hash/${hash}`);
  return data ?? null;
}

export async function fetchTokenHolders(tokenHash) {
  const data = await fetchJson(`${getActiveNode()}/${tokenHash}/holders`);
  return Array.isArray(data) ? data : [];
}

export async function fetchAllRejectedTxs() {
  const data = await fetchJson(`${getActiveNode()}/rejected/all`);
  if (!data) return [];

  return Object.values(data).map((txStr, i) => {
    try {
      return JSON.parse(txStr);
    } catch (e) {
      console.warn(`⚠️ Failed to parse rejected TX #${i}:`, e, txStr);
      return null;
    }
  }).filter(Boolean);
}












  