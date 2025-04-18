import express from 'express';
import cors from 'cors';
import beanmojiRoutes from './routes/beanmojiRoutes.js';

const app = express();
const PORT = 3001;

// 🔓 Enable CORS for your frontend (http://localhost:5173 for Vite)
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://limabean.xyz'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin'); // <== Important for proper caching
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});


app.use(express.json());

// 📦 Route for all /api/beanmoji/* requests
app.use('/bean', beanmojiRoutes);


app.use((req, res, next) => {
  console.warn('Unhandled request:', req.method, req.originalUrl);
  next();
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🫘 Beanmoji backend running at http://localhost:${PORT}`);
});

