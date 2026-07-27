// Admin Game Management Service

const games = [
  {
    id: 1,
    name: 'Golden Dragon Slots',
    type: 'slot',
    provider: 'pragmatic',
    rtp: 96.5,
    minBet: 0.1,
    maxBet: 100,
    status: 'active',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Spribe Aviator',
    type: 'crash',
    provider: 'spribe',
    rtp: 97,
    minBet: 0.5,
    maxBet: 1000,
    status: 'active',
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Live Blackjack',
    type: 'live',
    provider: 'evolution',
    rtp: 99,
    minBet: 1,
    maxBet: 500,
    status: 'active',
    createdAt: new Date()
  },
  {
    id: 4,
    name: 'Sweet Bonanza',
    type: 'slot',
    provider: 'pragmatic',
    rtp: 96.48,
    minBet: 0.1,
    maxBet: 100,
    status: 'active',
    createdAt: new Date()
  }
];

class GameManagementService {
  static addGame(gameData) {
    const newGame = {
      id: Math.max(...games.map(g => g.id), 0) + 1,
      ...gameData,
      createdAt: new Date()
    };
    games.push(newGame);
    return newGame;
  }

  static getGames() {
    return games;
  }

  static getGameById(id) {
    return games.find(g => g.id === id);
  }

  static updateGame(id, updates) {
    const game = games.find(g => g.id === id);
    if (!game) throw new Error('Game not found');
    Object.assign(game, updates);
    return game;
  }

  static deleteGame(id) {
    const index = games.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Game not found');
    const deleted = games.splice(index, 1);
    return deleted[0];
  }

  static toggleGameStatus(id) {
    const game = games.find(g => g.id === id);
    if (!game) throw new Error('Game not found');
    game.status = game.status === 'active' ? 'inactive' : 'active';
    return game;
  }
}

module.exports = GameManagementService;
