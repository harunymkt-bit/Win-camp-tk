// Payment Service - Handles payment processing

const { v4: uuidv4 } = require('uuid');

class PaymentService {
  static payments = new Map();

  // Process deposit
  static processDeposit(playerId, amount, method, details = {}) {
    if (amount <= 0) throw new Error('Invalid amount');

    const payment = {
      id: uuidv4(),
      playerId,
      type: 'deposit',
      amount,
      method, // 'card', 'bank', 'crypto', 'wallet'
      status: 'processing',
      details,
      createdAt: new Date(),
      processedAt: null
    };

    this.payments.set(payment.id, payment);

    // Simulate payment processing
    setTimeout(() => {
      payment.status = 'completed';
      payment.processedAt = new Date();
    }, 1000);

    return payment;
  }

  // Process withdrawal
  static processWithdrawal(playerId, amount, method, details = {}) {
    if (amount <= 0) throw new Error('Invalid amount');

    const payment = {
      id: uuidv4(),
      playerId,
      type: 'withdrawal',
      amount,
      method,
      status: 'pending_approval',
      details,
      createdAt: new Date(),
      approvedAt: null
    };

    this.payments.set(payment.id, payment);
    return payment;
  }

  // Get payment status
  static getPaymentStatus(paymentId) {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  // Approve withdrawal
  static approveWithdrawal(paymentId) {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.type !== 'withdrawal') throw new Error('Not a withdrawal');

    payment.status = 'completed';
    payment.approvedAt = new Date();
    return payment;
  }

  // Reject withdrawal
  static rejectWithdrawal(paymentId, reason) {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error('Payment not found');

    payment.status = 'rejected';
    payment.rejectionReason = reason;
    return payment;
  }
}

module.exports = PaymentService;
