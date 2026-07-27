// RNG (Random Number Generator) - Fair and secure random number generation

const crypto = require('crypto');

class RNG {
  // Generate random float between 0 and 1
  static random() {
    return Math.random();
  }

  // Generate cryptographically secure random number
  static secureRandom() {
    return crypto.randomBytes(32).readUInt32BE(0) / 0x100000000;
  }

  // Generate random integer between min and max
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate random float between min and max
  static randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Simulate slot machine spin
  static spinSlot(reels = 3, symbols = 10) {
    const result = [];
    for (let i = 0; i < reels; i++) {
      result.push(this.randomInt(0, symbols - 1));
    }
    return result;
  }

  // Simulate crash game multiplier
  static crashMultiplier(baseMultiplier = 1.01, maxMultiplier = 100) {
    let multiplier = baseMultiplier;
    while (multiplier < maxMultiplier && Math.random() > 0.02) {
      multiplier += baseMultiplier;
    }
    return parseFloat(multiplier.toFixed(2));
  }

  // Dice roll
  static diceRoll(sides = 6) {
    return this.randomInt(1, sides);
  }

  // Card shuffle
  static shuffleCards(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Roulette spin
  static rouletteSpin(numbers = 37) {
    return this.randomInt(0, numbers - 1);
  }
}

module.exports = RNG;
