require('dotenv').config();
const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const walletRoutes = require('./routes/walletRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/wallet', walletRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Casino Games Hosting Platform - Active' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎰 Casino Games Hosting Platform running on port ${PORT}`);
});

module.exports = app;
