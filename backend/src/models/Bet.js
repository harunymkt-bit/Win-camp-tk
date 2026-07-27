// Bet Model - Handles game bets and results

const { v4: uuidv4 } = require('uuid');

class Bet {
  constructor(playerId, gameId, amount, multiplier = 1) {
    this.id = uuidv4();
    this.playerId = playerId;
    this.gameId = gameId;
    this.amount = amount;
    this.multiplier = multiplier;
    this.status = 'active'; // 'active', 'won', 'lost', 'cancelled'
    this.createdAt = new Date();
    this.resultAt = null;
    this.winAmount = 0;
  }

  win(multiplier) {
    this.status = 'won';
    this.winAmount = this.amount * multiplier;
    this.resultAt = new Date();
    return this.winAmount;
  }

  lose() {
    this.status = 'lost';
    this.resultAt = new Date();
    return 0;
  }
}

module.exports = Bet;
