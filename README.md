# LimaBean Wallet

**LimaBean Wallet** is the official open-source wallet interface for the [BeanChain](https://beanchain.io) network.

It includes:
- `bean-wallet-app/` — Frontend built with React + Vite
- `wallet-backend/` *(obsolete)* — Legacy Node.js backend (formerly used for BeanMoji features, which have been removed)

> ⚠️ This is a **live testnet example** built and maintained by the BeanChain core team.  
> The code is fully open source to help developers learn from and build upon our approach.  
> Visit the wallet at [https://limabean.xyz](https://limabean.xyz)

---

## Features

- Generate or import a BeanChain wallet (private key-based)
- View wallet balance and transaction history
- Send BEAN and Layer 2 tokens
- Mint and manage tokens
- QR code support for mobile usage
- Clean, responsive design with theme switching

---

## 🌐 Network Connection

The LimaBean Wallet is connected to the **official BeanChain testnet**.

It is serviced by a **server-side BeanNode** that connects directly to the BeanChain P2P network.  
All transactions are processed on-chain within the testnet environment.

---

## 🛠️ Local Development

You can run the **frontend** locally to build or customize your own version.

### Frontend (React + Vite)

```bash
cd bean-wallet-app
npm install
npm run dev
```

## ❌ Obsolete Backend

The `wallet-backend/` folder was used for experimental features like **BeanMojis** and faucet relay logic.  
These features have been removed for now, and the backend is no longer required or maintained.

> If you're building new backend services, connect directly to a BeanNode using its public API.

---

## 🧪 Getting Test BEAN

To request testnet BEAN:

- Use the **Faucet** button at [https://limabean.xyz](https://limabean.xyz)
- Or use the `/faucet` command in the [BeanChain Discord](https://discord.gg/t64HF9B33T)
- Or use gpn.beanchain.io/rn/faucet/drip/{YOUR BEAN ADDRESS}

---

## 👥 Community & Support

- Discord: [BeanChain Discord](https://discord.gg/t64HF9B33T)
- GitHub Issues: Submit bugs or suggestions here
- Use `/issue` in Discord to report directly to the team
- Project updates and docs: [https://beanchain.io](https://beanchain.io)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

