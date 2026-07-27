require('dotenv').config();
const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const walletRoutes = require('./routes/walletRoutes');
const authRoutes = require('./routes/authRoutes');
const betRoutes = require('./routes/betRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Casino Games Hosting Platform - Active' });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    platform: 'Casino Games Hosting Platform',
    version: '1.0.0',
    status: 'active',
    features: [
      'Game Management',
      'Player Authentication',
      'Wallet System',
      'Betting System',
      'Payment Processing',
      'Analytics & Statistics',
      'RNG System'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🎰 Casino Games Hosting Platform running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});

module.exports = app;
