// Game Model - Represents casino games

class Game {
  constructor(id, name, type, provider, rtp, minBet, maxBet, status) {
    this.id = id;
    this.name = name;
    this.type = type; // 'slot', 'table', 'live'
    this.provider = provider; // 'pragmatic', 'spribe', 'jili', etc
    this.rtp = rtp; // Return to Player percentage
    this.minBet = minBet;
    this.maxBet = maxBet;
    this.status = status; // 'active', 'inactive'
    this.createdAt = new Date();
  }

  static mockGames = [
    {
      id: 1,
      name: 'Golden Dragon Slots',
      type: 'slot',
      provider: 'pragmatic',
      rtp: 96.5,
      minBet: 0.1,
      maxBet: 100,
      status: 'active'
    },
    {
      id: 2,
      name: 'Spribe Aviator',
      type: 'crash',
      provider: 'spribe',
      rtp: 97,
      minBet: 0.5,
      maxBet: 1000,
      status: 'active'
    },
    {
      id: 3,
      name: 'Live Blackjack',
      type: 'live',
      provider: 'evolution',
      rtp: 99,
      minBet: 1,
      maxBet: 500,
      status: 'active'
    },
    {
      id: 4,
      name: 'Sweet Bonanza',
      type: 'slot',
      provider: 'pragmatic',
      rtp: 96.48,
      minBet: 0.1,
      maxBet: 100,
      status: 'active'
    }
  ];
}

module.exports = Game;
