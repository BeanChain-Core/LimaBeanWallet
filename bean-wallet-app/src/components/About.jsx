import React from 'react';
import { useParams } from 'react-router-dom';
import './About.css';

const AboutContent = {
    beantoshi: {
      title: 'What is a Beantoshi?',
      body: `A Beantoshi is the smallest indivisible unit of BEAN, similar to how a satoshi functions in Bitcoin. 
  
  1 BEAN = 100,000,000 beantoshi.
  
  This level of granularity allows for micro-transactions, precision gas fee calculations, and scalable transaction systems. It enables fractional ownership, rounding-free transfers, and affordable payments even when dealing with very small values. 
  
  For example, you can send 0.000001 BEAN — that's exactly 100 beantoshi.`
    },
    beanchainteam: {
      title: 'Meet the BeanChain Team',
      body: `The BeanChain core team is a collective of developers, designers, and crypto-native visionaries who believe in decentralization, accessibility, and fun. 
  
  We're building everything from scratch — no forks, no copies — just real engineering. 
  
  Our goal is to create a lightweight and modular blockchain network that makes it easy for anyone to use, build on, or contribute to. BeanChain is community-first and guided by experimentation, transparency, and a shared passion for playful tech.`
    },
    gasfee: {
      title: 'Understanding Gas Fees on BeanChain',
      body: `Gas fees are small transaction costs paid to the network to compensate validators for processing transactions. 
  
  They help prevent spam and prioritize important transactions. Gas fees are measured in beantoshi (the smallest unit of BEAN), and users can set their own fee amount to speed up or economize a transaction.
  
  Higher gas = faster confirmation. Lower gas = slower (or possibly rejected).
  
  You can customize the gas fee in your transaction form, typically around 2,000 beantoshi (0.00002 BEAN) by default.`
    },
    default: {
      title: 'About BeanChain',
      body: `BeanChain is a lightweight blockchain network designed for speed, simplicity, and creativity. 
  
  With custom transaction types, system-wide modularity, and an open development model, BeanChain empowers developers and communities to build decentralized applications with ease. 
  
  We're not just creating a chain — we're building a playful but powerful platform for real use.`
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