// Analytics Service - Track player and game statistics

class AnalyticsService {
  static playerStats = new Map();
  static gameStats = new Map();

  // Initialize player stats
  static initializePlayerStats(playerId) {
    if (!this.playerStats.has(playerId)) {
      this.playerStats.set(playerId, {
        playerId,
        totalBets: 0,
        totalWinnings: 0,
        totalLosses: 0,
        winRate: 0,
        favoriteGame: null,
        gamesPlayed: {},
        totalSessionTime: 0,
        lastSession: null,
        createdAt: new Date()
      });
    }
    return this.playerStats.get(playerId);
  }

  // Record bet
  static recordBet(playerId, gameId, amount, result, winAmount = 0) {
    const stats = this.initializePlayerStats(playerId);
    
    stats.totalBets += amount;
    if (result === 'win') {
      stats.totalWinnings += winAmount;
    } else {
      stats.totalLosses += amount;
    }

    stats.winRate = stats.totalBets > 0 ? (stats.totalWinnings / stats.totalBets * 100).toFixed(2) : 0;
    stats.lastSession = new Date();

    if (!stats.gamesPlayed[gameId]) {
      stats.gamesPlayed[gameId] = { count: 0, amount: 0, winnings: 0 };
    }
    stats.gamesPlayed[gameId].count++;
    stats.gamesPlayed[gameId].amount += amount;
    if (result === 'win') {
      stats.gamesPlayed[gameId].winnings += winAmount;
    }

    // Update favorite game
    let maxPlays = 0;
    for (let [game, data] of Object.entries(stats.gamesPlayed)) {
      if (data.count > maxPlays) {
        maxPlays = data.count;
        stats.favoriteGame = game;
      }
    }

    return stats;
  }

  // Get player stats
  static getPlayerStats(playerId) {
    return this.playerStats.get(playerId) || this.initializePlayerStats(playerId);
  }

  // Initialize game stats
  static initializeGameStats(gameId, gameName) {
    if (!this.gameStats.has(gameId)) {
      this.gameStats.set(gameId, {
        gameId,
        gameName,
        totalPlays: 0,
        totalBetAmount: 0,
        totalPayouts: 0,
        uniquePlayers: new Set(),
        averageBet: 0,
        houseEdge: 0,
        createdAt: new Date()
      });
    }
    return this.gameStats.get(gameId);
  }

  // Record game play
  static recordGamePlay(gameId, gameName, playerId, betAmount, payout) {
    const stats = this.initializeGameStats(gameId, gameName);
    
    stats.totalPlays++;
    stats.totalBetAmount += betAmount;
    stats.totalPayouts += payout;
    stats.uniquePlayers.add(playerId);
    stats.averageBet = (stats.totalBetAmount / stats.totalPlays).toFixed(2);
    stats.houseEdge = ((stats.totalBetAmount - stats.totalPayouts) / stats.totalBetAmount * 100).toFixed(2);

    return stats;
  }

  // Get game stats
  static getGameStats(gameId) {
    return this.gameStats.get(gameId);
  }

  // Get all games stats
  static getAllGameStats() {
    return Array.from(this.gameStats.values());
  }
}

module.exports = AnalyticsService;
