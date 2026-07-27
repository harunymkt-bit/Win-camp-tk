// Player Model - Represents casino players/users

const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(username, email, password) {
    this.id = uuidv4();
    this.username = username;
    this.email = email;
    this.password = password; // Should be hashed
    this.balance = 0;
    this.totalWinnings = 0;
    this.totalLosses = 0;
    this.status = 'active'; // 'active', 'suspended', 'banned'
    this.createdAt = new Date();
    this.lastLogin = null;
  }

  updateBalance(amount) {
    this.balance += amount;
    if (amount > 0) {
      this.totalWinnings += amount;
    } else {
      this.totalLosses += Math.abs(amount);
    }
  }
}

module.exports = Player;
