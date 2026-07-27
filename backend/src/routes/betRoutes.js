const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet');
const RNG = require('../utils/RNG');
const AnalyticsService = require('../services/AnalyticsService');

const bets = new Map();

// Place a bet
router.post('/place', (req, res) => {
  try {
    const { playerId, gameId, amount } = req.body;
    
    if (!playerId || !gameId || !amount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const bet = new Bet(playerId, gameId, amount);
    bets.set(bet.id, bet);

    // Record analytics
    AnalyticsService.recordGamePlay(gameId, 'Game', playerId, amount, 0);

    res.json({
      success: true,
      message: 'Bet placed successfully',
      bet: {
        id: bet.id,
        playerId: bet.playerId,
        gameId: bet.gameId,
        amount: bet.amount,
        status: bet.status,
        createdAt: bet.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resolve bet (win/loss)
router.post('/:betId/resolve', (req, res) => {
  try {
    const { betId } = req.params;
    const { result, multiplier } = req.body;

    const bet = bets.get(betId);
    if (!bet) {
      return res.status(404).json({ success: false, error: 'Bet not found' });
    }

    let winAmount = 0;
    if (result === 'win') {
      winAmount = bet.win(multiplier || 2);
      AnalyticsService.recordBet(bet.playerId, bet.gameId, bet.amount, 'win', winAmount);
    } else {
      bet.lose();
      AnalyticsService.recordBet(bet.playerId, bet.gameId, bet.amount, 'loss');
    }

    res.json({
      success: true,
      bet: {
        id: bet.id,
        status: bet.status,
        winAmount,
        resultAt: bet.resultAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get bet details
router.get('/:betId', (req, res) => {
  try {
    const bet = bets.get(req.params.betId);
    if (!bet) {
      return res.status(404).json({ success: false, error: 'Bet not found' });
    }
    res.json({ success: true, bet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get player bets
router.get('/player/:playerId', (req, res) => {
  try {
    const playerBets = Array.from(bets.values()).filter(b => b.playerId === req.params.playerId);
    res.json({
      success: true,
      total: playerBets.length,
      bets: playerBets
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
