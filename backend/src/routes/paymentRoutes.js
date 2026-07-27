const express = require('express');
const router = express.Router();
const PaymentService = require('../services/PaymentService');

// Process deposit
router.post('/deposit', (req, res) => {
  try {
    const { playerId, amount, method, cardDetails } = req.body;
    
    if (!playerId || !amount || !method) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const payment = PaymentService.processDeposit(playerId, amount, method, { cardDetails });

    res.json({
      success: true,
      message: 'Deposit processing',
      payment: {
        id: payment.id,
        type: payment.type,
        amount: payment.amount,
        status: payment.status,
        method: payment.method
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Process withdrawal
router.post('/withdraw', (req, res) => {
  try {
    const { playerId, amount, method, bankDetails } = req.body;
    
    if (!playerId || !amount || !method) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const payment = PaymentService.processWithdrawal(playerId, amount, method, { bankDetails });

    res.json({
      success: true,
      message: 'Withdrawal request submitted for approval',
      payment: {
        id: payment.id,
        type: payment.type,
        amount: payment.amount,
        status: payment.status,
        method: payment.method
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get payment status
router.get('/status/:paymentId', (req, res) => {
  try {
    const payment = PaymentService.getPaymentStatus(req.params.paymentId);
    res.json({ success: true, payment });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Approve withdrawal (admin)
router.post('/:paymentId/approve', (req, res) => {
  try {
    const payment = PaymentService.approveWithdrawal(req.params.paymentId);
    res.json({
      success: true,
      message: 'Withdrawal approved',
      payment
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reject withdrawal (admin)
router.post('/:paymentId/reject', (req, res) => {
  try {
    const { reason } = req.body;
    const payment = PaymentService.rejectWithdrawal(req.params.paymentId, reason);
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
