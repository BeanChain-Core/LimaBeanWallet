import React from 'react';
import { useParams } from 'react-router-dom';
import './About.css';

const AboutContent = {
    beantoshi: {
      title: 'What is a Beantoshi?',
      body: `A Beantoshi is the smallest indivisible unit of BEAN — similar to a satoshi in Bitcoin, but with 6 decimal places instead of 8.

    1 BEAN = 1,000,000 beantoshi.

    This allows for micro-transactions, accurate gas fees, and smooth scaling across applications. You can even send as little as 0.000001 BEAN — that's exactly **1 beantoshi**.`
    },
    faucet: {
      title: 'What is a Faucet, and how does it work?',
      body: `The BeanChain Faucet is a system that distributes free $BEAN tokens to help new users get started.

      The faucet wallet was funded at genesis and is managed automatically by the Reward Node (RN), not by any individual. To prevent abuse and ensure fairness, each wallet must wait for a cooldown period between faucet requests.

      Every time a faucet drip is claimed — by any wallet — the amount given decreases slightly. The first drip starts at 100 $BEAN, and each drip after that reduces the amount programmatically. Over time, the faucet will eventually reach a minimum of 1 $BEAN per drip. Once the faucet wallet is fully depleted, the faucet shuts off forever.

      This mechanism ensures fair distribution, discourages spamming, and rewards early participants in the BeanChain network.`
    },
    'seed-phrases': {
      title: 'What is a Seed Phrase?',
      body: `A seed phrase is a set of 12 or 24 simple words that acts as the master key to your wallet. It’s generated when you create a new wallet and can be used to restore access to your funds on any compatible wallet app.

    Unlike usernames or passwords, seed phrases **should never be stored online or shared**. Anyone with access to your seed phrase can take full control of your wallet and assets.

    Each word in the phrase is chosen from a standardized list of 2048 English words. This ensures compatibility across different wallets and blockchains that use the same BIP-39 standard.

    **If you lose your seed phrase, you lose access to your wallet forever.** There's no way to reset or recover it. That's why it’s important to store it somewhere safe — offline, and ideally written down in multiple secure locations.`
    },
    'seed-phrase-entry': {
      title: 'How to Enter a Seed Phrase Correctly',
      body: `A seed phrase (also called a recovery phrase or mnemonic) is a sequence of 12 or 24 words that can regenerate your wallet and access your $BEAN tokens.

    Each word must be separated by a **single space** — not commas, line breaks, or double spaces. For example:

    \`seed bulb quantum apple solar joke roast echo... \`

    If any word is misspelled or spacing is incorrect, the phrase will be considered invalid and cannot be used to recover your wallet.

    Seed phrases are case-insensitive, but they must exactly match one of the approved words from the official wordlist.

    For security, never share your seed phrase with anyone. Anyone who has access to it can access your wallet and funds.`
    },
    gasfee: {
      title: 'Understanding Gas Fees on BeanChain',
      body: `Every transaction on BeanChain requires a small **gas fee** to reward validators and keep the network secure.

  You’ll enter this fee (amount of BEAN to pay) when filling out the transaction form.

  - A typical gas fee is currently around **0.00002 BEAN** 
  - Higher fees get confirmed faster
  - Low or zero fees may be delayed or rejected

  Gas fees are not burned — they are paid to the validator who confirms the transaction. You control how much to pay based on how fast you want your TX to process.`
    },
    default: {
      title: 'About LimaBean Wallet',
      body: `**LimaBean Wallet** is the official web wallet for the BeanChain network — a lightweight, secure, and playful way to manage your BEAN and tokens.

      Designed for simplicity and speed, LimaBean lets you:
      - Send and receive BEAN
      - Mint and manage tokens
      - View pending and confirmed transactions
      - Connect to the testnet or mainnet with ease

      Built entirely on custom infrastructure, LimaBean Wallet is non-custodial, privacy-friendly, and tailored for builders and everyday users alike. No browser extensions. No extra steps. Just BEAN.`
      }
  };

const About = () => {
  const { topic } = useParams();
  const content = AboutContent[topic] || AboutContent.default;

  return (
    <div className="about-page-wrapper">
      <div className="about-card">
        <h1 className="about-title">{content.title}</h1>
        <div className='body-box'>
            <p className="about-body">{content.body}</p>
        </div>
      </div>
    </div>
  );
};

export default About;