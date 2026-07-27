const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');

const wallets = new Map();

// Get wallet balance
router.get('/:playerId/balance', (req, res) => {
  try {
    let wallet = wallets.get(req.params.playerId);
    if (!wallet) {
      wallet = new Wallet(req.params.playerId, 1000); // Default balance
      wallets.set(req.params.playerId, wallet);
    }
    res.json({
      success: true,
      balance: wallet.balance,
      currency: wallet.currency
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deposit funds
router.post('/:playerId/deposit', (req, res) => {
  try {
    const { amount, method } = req.body;
    let wallet = wallets.get(req.params.playerId);
    if (!wallet) {
      wallet = new Wallet(req.params.playerId, 0);
      wallets.set(req.params.playerId, wallet);
    }
    
    const result = wallet.deposit(amount, method);
    res.json({
      success: result.success,
      newBalance: result.newBalance,
      message: 'Deposit successful'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Withdraw funds
router.post('/:playerId/withdraw', (req, res) => {
  try {
    const { amount, method } = req.body;
    let wallet = wallets.get(req.params.playerId);
    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }
    
    const result = wallet.withdraw(amount, method);
    res.json({
      success: result.success,
      newBalance: result.newBalance,
      message: 'Withdrawal successful'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Place bet
router.post('/:playerId/bet', (req, res) => {
  try {
    const { amount, gameId } = req.body;
    let wallet = wallets.get(req.params.playerId);
    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }
    
    const result = wallet.bet(amount, gameId);
    res.json({
      success: result.success,
      newBalance: result.newBalance,
      message: 'Bet placed successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Record win
router.post('/:playerId/win', (req, res) => {
  try {
    const { amount, gameId, betId } = req.body;
    let wallet = wallets.get(req.params.playerId);
    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }
    
    const result = wallet.win(amount, gameId, betId);
    res.json({
      success: result.success,
      newBalance: result.newBalance,
      message: 'Winnings credited'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
