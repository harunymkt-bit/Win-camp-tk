const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Get all games
router.get('/', (req, res) => {
  try {
    const games = Game.mockGames;
    res.json({
      success: true,
      total: games.length,
      games
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get game by ID
router.get('/:id', (req, res) => {
  try {
    const game = Game.mockGames.find(g => g.id === parseInt(req.params.id));
    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }
    res.json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get games by type
router.get('/type/:type', (req, res) => {
  try {
    const games = Game.mockGames.filter(g => g.type === req.params.type);
    res.json({
      success: true,
      total: games.length,
      games
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get games by provider
router.get('/provider/:provider', (req, res) => {
  try {
    const games = Game.mockGames.filter(g => g.provider === req.params.provider);
    res.json({
      success: true,
      total: games.length,
      games
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
