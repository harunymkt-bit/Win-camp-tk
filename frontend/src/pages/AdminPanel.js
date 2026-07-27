import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

const AdminPanel = ({ token }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [gameStats, setGameStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'dashboard':
          const gameRes = await axios.get('/api/games');
          setGames(gameRes.data.games || []);
          const statsRes = await axios.get('/api/analytics/games/all/stats');
          setGameStats(statsRes.data.stats || []);
          break;
        case 'games':
          const gRes = await axios.get('/api/games');
          setGames(gRes.data.games || []);
          break;
        case 'payments':
          // Mock payment data
          setPayments([
            { id: 1, playerId: 'p1', amount: 100, type: 'deposit', status: 'completed', date: '2024-01-20' },
            { id: 2, playerId: 'p2', amount: 50, type: 'withdrawal', status: 'pending', date: '2024-01-20' },
            { id: 3, playerId: 'p3', amount: 200, type: 'deposit', status: 'completed', date: '2024-01-19' }
          ]);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>🎰 Admin Dashboard</h1>
        <p>Casino Games Management System</p>
      </header>

      <nav className="admin-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === 'games' ? 'active' : ''}
          onClick={() => setActiveTab('games')}
        >
          🎮 Games
        </button>
        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          💳 Payments
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      <main className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Games</h3>
                <p className="stat-value">{games.length}</p>
              </div>
              <div className="stat-card">
                <h3>Active Players</h3>
                <p className="stat-value">24</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">$12,450</p>
              </div>
              <div className="stat-card">
                <h3>Total Bets</h3>
                <p className="stat-value">1,234</p>
              </div>
            </div>

            <div className="game-stats-section">
              <h3>Top Games</h3>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Game Name</th>
                    <th>Total Plays</th>
                    <th>Total Bets</th>
                    <th>Avg Bet</th>
                    <th>House Edge</th>
                  </tr>
                </thead>
                <tbody>
                  {gameStats.map((stat) => (
                    <tr key={stat.gameId}>
                      <td>{stat.gameName}</td>
                      <td>{stat.totalPlays}</td>
                      <td>${parseFloat(stat.totalBetAmount).toFixed(2)}</td>
                      <td>${stat.averageBet}</td>
                      <td>{stat.houseEdge}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="tab-content">
            <h2>Manage Games</h2>
            <table className="games-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Provider</th>
                  <th>RTP</th>
                  <th>Min Bet</th>
                  <th>Max Bet</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td>{game.id}</td>
                    <td>{game.name}</td>
                    <td>{game.type}</td>
                    <td>{game.provider}</td>
                    <td>{game.rtp}%</td>
                    <td>${game.minBet}</td>
                    <td>${game.maxBet}</td>
                    <td>
                      <span className={`status ${game.status}`}>
                        {game.status}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="tab-content">
            <h2>Payment Management</h2>
            <table className="payments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Player ID</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.playerId}</td>
                    <td>${payment.amount}</td>
                    <td>{payment.type}</td>
                    <td>
                      <span className={`status ${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.date}</td>
                    <td>
                      {payment.status === 'pending' && (
                        <>
                          <button className="approve-btn">Approve</button>
                          <button className="reject-btn">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <h2>Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Revenue Breakdown</h3>
                <p>Daily: $1,234</p>
                <p>Weekly: $8,540</p>
                <p>Monthly: $34,560</p>
              </div>
              <div className="analytics-card">
                <h3>Player Activity</h3>
                <p>New Players: 12</p>
                <p>Active Today: 24</p>
                <p>Total Registered: 156</p>
              </div>
              <div className="analytics-card">
                <h3>Game Performance</h3>
                <p>Most Played: Sweet Bonanza</p>
                <p>Highest RTP: Live Blackjack</p>
                <p>Total Games: {games.length}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
