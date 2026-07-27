const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/AnalyticsService');

// Get player statistics
router.get('/player/:playerId', (req, res) => {
  try {
    const stats = AnalyticsService.getPlayerStats(req.params.playerId);
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get game statistics
router.get('/game/:gameId', (req, res) => {
  try {
    const stats = AnalyticsService.getGameStats(req.params.gameId);
    if (!stats) {
      return res.status(404).json({ success: false, error: 'Game stats not found' });
    }
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all games statistics
router.get('/games/all/stats', (req, res) => {
  try {
    const stats = AnalyticsService.getAllGameStats();
    res.json({
      success: true,
      total: stats.length,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
