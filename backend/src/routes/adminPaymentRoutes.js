const express = require('express');
const router = express.Router();
const PaymentService = require('../services/PaymentService');

const approvedWithdrawals = new Map();

// Get all pending withdrawals
router.get('/withdrawals', (req, res) => {
  try {
    const withdrawals = Array.from(PaymentService.payments.values())
      .filter(p => p.type === 'withdrawal');
    
    res.json({
      success: true,
      total: withdrawals.length,
      withdrawals
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all deposits
router.get('/deposits', (req, res) => {
  try {
    const deposits = Array.from(PaymentService.payments.values())
      .filter(p => p.type === 'deposit');
    
    res.json({
      success: true,
      total: deposits.length,
      deposits
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve withdrawal
router.post('/approve/:paymentId', (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = PaymentService.approveWithdrawal(paymentId);
    approvedWithdrawals.set(paymentId, payment);

    res.json({
      success: true,
      message: 'Withdrawal approved',
      payment
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reject withdrawal
router.post('/reject/:paymentId', (req, res) => {
  try {
    const { paymentId, reason } = req.body;
    const payment = PaymentService.rejectWithdrawal(paymentId, reason || 'Rejected by admin');

    res.json({
      success: true,
      message: 'Withdrawal rejected',
      payment
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
