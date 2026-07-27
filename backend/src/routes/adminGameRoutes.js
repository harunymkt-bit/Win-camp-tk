const express = require('express');
const router = express.Router();
const GameManagementService = require('../services/GameManagementService');

// Get all games (admin view)
router.get('/', (req, res) => {
  try {
    const games = GameManagementService.getGames();
    res.json({
      success: true,
      total: games.length,
      games
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new game
router.post('/', (req, res) => {
  try {
    const { name, type, provider, rtp, minBet, maxBet, status } = req.body;

    if (!name || !type || !provider || !rtp) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newGame = GameManagementService.addGame({
      name,
      type,
      provider,
      rtp: parseFloat(rtp),
      minBet: parseFloat(minBet) || 0.1,
      maxBet: parseFloat(maxBet) || 100,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Game added successfully',
      game: newGame
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update game
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedGame = GameManagementService.updateGame(parseInt(id), updates);

    res.json({
      success: true,
      message: 'Game updated successfully',
      game: updatedGame
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete game
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = GameManagementService.deleteGame(parseInt(id));

    res.json({
      success: true,
      message: 'Game deleted successfully',
      game: deletedGame
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Toggle game status
router.post('/:id/toggle-status', (req, res) => {
  try {
    const { id } = req.params;
    const game = GameManagementService.toggleGameStatus(parseInt(id));

    res.json({
      success: true,
      message: `Game ${game.status}`,
      game
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
