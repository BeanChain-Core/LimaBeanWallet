import express from 'express';
import fs from 'fs';
import { getUserBeans, addUserBean } from '../utils/beanmojiStore.js';

const router = express.Router();

router.get('/collection/:address', (req, res) => {
  const address = req.params.address;
  const beans = getUserBeans(address);
  res.json(beans);
});

router.post('/claim', (req, res) => {
  const { wallet, beanName } = req.body;
  if (!wallet || !beanName) {
    return res.status(400).json({ error: 'Missing wallet or beanName' });
  }

  addUserBean(wallet, beanName);
  res.json({ success: true });
});

router.get('/all', (req, res) => {
  try {
    const raw = fs.readFileSync('./data/beanCatalog.json');
    const catalog = JSON.parse(raw);
    res.json(catalog);
  } catch (err) {
    console.error('Failed to load bean catalog:', err);
    res.status(500).json({ error: 'Failed to load bean catalog' });
  }
});


export default router;
