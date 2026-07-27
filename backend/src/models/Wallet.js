// Wallet Model - Handles player wallet/balance management

const { v4: uuidv4 } = require('uuid');

class Wallet {
  constructor(playerId, balance = 0) {
    this.id = uuidv4();
    this.playerId = playerId;
    this.balance = balance;
    this.currency = 'USD';
    this.transactions = [];
    this.createdAt = new Date();
  }

  deposit(amount, method = 'card') {
    if (amount <= 0) throw new Error('Invalid deposit amount');
    this.balance += amount;
    this.transactions.push({
      id: uuidv4(),
      type: 'deposit',
      amount,
      method,
      timestamp: new Date(),
      balanceAfter: this.balance
    });
    return { success: true, newBalance: this.balance };
  }

  withdraw(amount, method = 'card') {
    if (amount <= 0) throw new Error('Invalid withdrawal amount');
    if (amount > this.balance) throw new Error('Insufficient balance');
    this.balance -= amount;
    this.transactions.push({
      id: uuidv4(),
      type: 'withdraw',
      amount,
      method,
      timestamp: new Date(),
      balanceAfter: this.balance
    });
    return { success: true, newBalance: this.balance };
  }

  bet(amount, gameId) {
    if (amount > this.balance) throw new Error('Insufficient balance for bet');
    this.balance -= amount;
    this.transactions.push({
      id: uuidv4(),
      type: 'bet',
      amount,
      gameId,
      timestamp: new Date(),
      balanceAfter: this.balance
    });
    return { success: true, newBalance: this.balance };
  }

  win(amount, gameId, betId) {
    this.balance += amount;
    this.transactions.push({
      id: uuidv4(),
      type: 'win',
      amount,
      gameId,
      betId,
      timestamp: new Date(),
      balanceAfter: this.balance
    });
    return { success: true, newBalance: this.balance };
  }
}

module.exports = Wallet;
