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