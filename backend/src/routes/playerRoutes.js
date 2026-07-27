const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

const players = new Map();

// Get player profile
router.get('/:playerId', (req, res) => {
  try {
    const player = players.get(req.params.playerId);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    res.json({
      success: true,
      player: {
        id: player.id,
        username: player.username,
        email: player.email,
        balance: player.balance,
        totalWinnings: player.totalWinnings,
        totalLosses: player.totalLosses,
        status: player.status,
        createdAt: player.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update player profile
router.put('/:playerId', (req, res) => {
  try {
    const player = players.get(req.params.playerId);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    
    const { username, email } = req.body;
    if (username) player.username = username;
    if (email) player.email = email;
    
    res.json({
      success: true,
      message: 'Player updated successfully',
      player
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
