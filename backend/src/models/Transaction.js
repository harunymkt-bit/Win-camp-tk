// Transaction Model - Handles all financial transactions

const { v4: uuidv4 } = require('uuid');

class Transaction {
  constructor(playerId, type, amount, method, status = 'pending') {
    this.id = uuidv4();
    this.playerId = playerId;
    this.type = type; // 'deposit', 'withdraw', 'bet', 'win'
    this.amount = amount;
    this.method = method; // 'card', 'bank', 'crypto', 'wallet'
    this.status = status; // 'pending', 'completed', 'failed', 'cancelled'
    this.timestamp = new Date();
    this.reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  markCompleted() {
    this.status = 'completed';
    this.completedAt = new Date();
  }

  markFailed(reason) {
    this.status = 'failed';
    this.failureReason = reason;
    this.failedAt = new Date();
  }
}

module.exports = Transaction;
