const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Player = require('../models/Player');

const players = new Map();

// Register
router.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Check if user already exists
    for (let player of players.values()) {
      if (player.email === email) {
        return res.status(409).json({ success: false, error: 'Email already registered' });
      }
    }
    
    const player = new Player(username, email, password);
    players.set(player.id, player);
    
    const token = jwt.sign(
      { playerId: player.id, email: player.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      player: {
        id: player.id,
        username: player.username,
        email: player.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    
    let player = null;
    for (let p of players.values()) {
      if (p.email === email && p.password === password) {
        player = p;
        break;
      }
    }
    
    if (!player) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    player.lastLogin = new Date();
    
    const token = jwt.sign(
      { playerId: player.id, email: player.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      player: {
        id: player.id,
        username: player.username,
        email: player.email,
        balance: player.balance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
