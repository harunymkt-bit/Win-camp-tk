import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PlayerDashboard.css';

const PlayerDashboard = ({ user, token }) => {
  const [balance, setBalance] = useState(0);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    fetchBalance();
    fetchGames();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`/api/wallet/${user.id}/balance`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games');
      setGames(response.data.games || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handlePlayGame = async () => {
    if (!selectedGame) {
      alert('Please select a game');
      return;
    }
    if (betAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      // Place bet
      const betResponse = await axios.post('/api/bets/place', {
        playerId: user.id,
        gameId: selectedGame.id,
        amount: betAmount
      });

      const betId = betResponse.data.bet.id;

      // Simulate game result (50% win rate)
      const isWin = Math.random() > 0.5;
      const multiplier = isWin ? Math.random() * 3 + 1 : 0;

      // Resolve bet
      const resolveResponse = await axios.post(`/api/bets/${betId}/resolve`, {
        result: isWin ? 'win' : 'loss',
        multiplier: multiplier
      });

      const result = {
        game: selectedGame.name,
        bet: betAmount,
        result: isWin ? 'WIN' : 'LOSS',
        winAmount: resolveResponse.data.bet.winAmount,
        timestamp: new Date().toLocaleString()
      };

      setGameHistory([result, ...gameHistory]);

      if (isWin) {
        // Update wallet with winnings
        await axios.post(`/api/wallet/${user.id}/win`, {
          amount: resolveResponse.data.bet.winAmount,
          gameId: selectedGame.id,
          betId
        });
      }

      fetchBalance();
      alert(isWin ? `🎉 You Won! $${resolveResponse.data.bet.winAmount.toFixed(2)}` : 'Sorry, you lost!');
    } catch (error) {
      alert('Error playing game: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      alert('Enter a valid amount');
      return;
    }

    try {
      await axios.post(`/api/wallet/${user.id}/deposit`, {
        amount: parseFloat(depositAmount),
        method: 'card'
      });
      fetchBalance();
      setDepositAmount('');
      setShowDepositModal(false);
      alert('Deposit successful!');
    } catch (error) {
      alert('Deposit failed: ' + error.message);
    }
  };

  return (
    <div className="player-dashboard">
      <header className="dashboard-header">
        <h1>🎰 Casino Games</h1>
        <div className="user-info">
          <p>Welcome, {user.username}!</p>
          <p className="balance">Balance: ${balance.toFixed(2)}</p>
          <button 
            className="deposit-btn"
            onClick={() => setShowDepositModal(true)}
          >
            💳 Deposit
          </button>
        </div>
      </header>

      {showDepositModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Deposit Funds</h2>
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={handleDeposit}>Deposit</button>
            <button onClick={() => setShowDepositModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <aside className="games-sidebar">
          <h3>Games</h3>
          {games.map((game) => (
            <div
              key={game.id}
              className={`game-card ${selectedGame?.id === game.id ? 'selected' : ''}`}
              onClick={() => setSelectedGame(game)}
            >
              <h4>{game.name}</h4>
              <p className="game-type">Type: {game.type}</p>
              <p className="game-provider">Provider: {game.provider}</p>
              <p className="game-rtp">RTP: {game.rtp}%</p>
              <p className="game-bet">Bet: ${game.minBet} - ${game.maxBet}</p>
            </div>
          ))}
        </aside>

        <main className="game-area">
          {selectedGame ? (
            <div className="game-player">
              <h2>{selectedGame.name}</h2>
              <div className="game-info">
                <p><strong>Type:</strong> {selectedGame.type}</p>
                <p><strong>Provider:</strong> {selectedGame.provider}</p>
                <p><strong>RTP:</strong> {selectedGame.rtp}%</p>
                <p><strong>Bet Range:</strong> ${selectedGame.minBet} - ${selectedGame.maxBet}</p>
              </div>

              <div className="betting-area">
                <label>Bet Amount:</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                  min={selectedGame.minBet}
                  max={Math.min(selectedGame.maxBet, balance)}
                />
                <button
                  className="play-btn"
                  onClick={handlePlayGame}
                  disabled={loading || balance < betAmount}
                >
                  {loading ? 'Playing...' : '▶️ Play'}
                </button>
              </div>
            </div>
          ) : (
            <div className="no-game-selected">
              <p>Select a game to play</p>
            </div>
          )}
        </main>

        <aside className="history-sidebar">
          <h3>Game History</h3>
          <div className="history-list">
            {gameHistory.map((entry, idx) => (
              <div key={idx} className={`history-entry ${entry.result.toLowerCase()}`}>
                <p className="game-name">{entry.game}</p>
                <p className="bet">Bet: ${entry.bet}</p>
                <p className={`result ${entry.result.toLowerCase()}`}>{entry.result}</p>
                {entry.result === 'WIN' && <p className="win-amount">+${entry.winAmount.toFixed(2)}</p>}
                <p className="timestamp">{entry.timestamp}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PlayerDashboard;
