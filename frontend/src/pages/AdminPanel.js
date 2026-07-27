import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

const AdminPanel = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [games, setGames] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states for adding game
  const [newGame, setNewGame] = useState({
    name: '',
    type: 'slot',
    provider: 'pragmatic',
    rtp: 96.5,
    minBet: 0.1,
    maxBet: 100,
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      switch (activeTab) {
        case 'dashboard':
        case 'games':
          await fetchGames();
          break;
        case 'payments':
          await fetchWithdrawals();
          await fetchDeposits();
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error fetching data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/admin/games');
      setGames(response.data.games || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get('/api/admin/payments/withdrawals');
      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await axios.get('/api/admin/payments/deposits');
      setDeposits(response.data.deposits || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    }
  };

  // Add new game
  const handleAddGame = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/games', newGame);
      setSuccessMessage(`✅ Game "${response.data.game.name}" added successfully!`);
      setShowAddGameModal(false);
      setNewGame({
        name: '',
        type: 'slot',
        provider: 'pragmatic',
        rtp: 96.5,
        minBet: 0.1,
        maxBet: 100,
        status: 'active'
      });
      await fetchGames();
    } catch (error) {
      setErrorMessage('❌ Error adding game: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete game
  const handleDeleteGame = async (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      setLoading(true);
      try {
        const response = await axios.delete(`/api/admin/games/${id}`);
        setSuccessMessage(`✅ Game "${response.data.game.name}" deleted successfully!`);
        await fetchGames();
      } catch (error) {
        setErrorMessage('❌ Error deleting game');
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle game status
  const handleToggleGameStatus = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/admin/games/${id}/toggle-status`);
      setSuccessMessage(`✅ Game ${response.data.game.status}!`);
      await fetchGames();
    } catch (error) {
      setErrorMessage('❌ Error updating game status');
    } finally {
      setLoading(false);
    }
  };

  // Approve withdrawal
  const handleApproveWithdrawal = async (paymentId) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/admin/payments/approve/${paymentId}`);
      setSuccessMessage('✅ Withdrawal approved!');
      await fetchWithdrawals();
    } catch (error) {
      setErrorMessage('❌ Error approving withdrawal');
    } finally {
      setLoading(false);
    }
  };

  // Reject withdrawal
  const handleRejectWithdrawal = async (paymentId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setLoading(true);
      try {
        const response = await axios.post(`/api/admin/payments/reject/${paymentId}`, { reason });
        setSuccessMessage('✅ Withdrawal rejected!');
        await fetchWithdrawals();
      } catch (error) {
        setErrorMessage('❌ Error rejecting withdrawal');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="header-content">
          <h1>🎰 Admin Dashboard</h1>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
        <p>Casino Games Management System</p>
      </header>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

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
                <h3>Active Games</h3>
                <p className="stat-value">{games.filter(g => g.status === 'active').length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Withdrawals</h3>
                <p className="stat-value">{withdrawals.filter(w => w.status === 'pending_approval').length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Deposits</h3>
                <p className="stat-value">{deposits.length}</p>
              </div>
            </div>

            <div className="game-stats-section">
              <h3>Available Games</h3>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Game Name</th>
                    <th>Type</th>
                    <th>Provider</th>
                    <th>RTP</th>
                    <th>Min Bet</th>
                    <th>Max Bet</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id}>
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
            <div className="games-header">
              <h2>Manage Games</h2>
              <button
                className="add-game-btn"
                onClick={() => setShowAddGameModal(true)}
              >
                ➕ Add New Game
              </button>
            </div>

            {showAddGameModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Add New Game</h2>
                  <form onSubmit={handleAddGame}>
                    <input
                      type="text"
                      placeholder="Game Name"
                      value={newGame.name}
                      onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                      required
                    />
                    <select
                      value={newGame.type}
                      onChange={(e) => setNewGame({ ...newGame, type: e.target.value })}
                    >
                      <option value="slot">Slot</option>
                      <option value="crash">Crash</option>
                      <option value="live">Live</option>
                      <option value="table">Table</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Provider"
                      value={newGame.provider}
                      onChange={(e) => setNewGame({ ...newGame, provider: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="RTP %"
                      step="0.01"
                      value={newGame.rtp}
                      onChange={(e) => setNewGame({ ...newGame, rtp: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Min Bet"
                      step="0.01"
                      value={newGame.minBet}
                      onChange={(e) => setNewGame({ ...newGame, minBet: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max Bet"
                      step="0.01"
                      value={newGame.maxBet}
                      onChange={(e) => setNewGame({ ...newGame, maxBet: e.target.value })}
                    />
                    <button type="submit" disabled={loading}>Add Game</button>
                    <button
                      type="button"
                      onClick={() => setShowAddGameModal(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            <table className="games-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Provider</th>
                  <th>RTP</th>
                  <th>Min/Max Bet</th>
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
                    <td>${game.minBet} - ${game.maxBet}</td>
                    <td>
                      <span className={`status ${game.status}`}>
                        {game.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="toggle-btn"
                        onClick={() => handleToggleGameStatus(game.id)}
                        disabled={loading}
                      >
                        {game.status === 'active' ? '🔴 Deactivate' : '🟢 Activate'}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteGame(game.id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
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
            <div className="payments-sections">
              <div className="payment-section">
                <h3>Pending Withdrawals</h3>
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Player ID</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals
                      .filter(w => w.status === 'pending_approval')
                      .map((withdrawal) => (
                        <tr key={withdrawal.id}>
                          <td>{withdrawal.id.substring(0, 8)}</td>
                          <td>{withdrawal.playerId}</td>
                          <td>${withdrawal.amount}</td>
                          <td>{withdrawal.method}</td>
                          <td>
                            <span className="status pending">
                              Pending
                            </span>
                          </td>
                          <td>
                            <button
                              className="approve-btn"
                              onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              disabled={loading}
                            >
                              ✅ Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              disabled={loading}
                            >
                              ❌ Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="payment-section">
                <h3>Completed Withdrawals</h3>
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Player ID</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals
                      .filter(w => w.status === 'completed')
                      .map((withdrawal) => (
                        <tr key={withdrawal.id}>
                          <td>{withdrawal.id.substring(0, 8)}</td>
                          <td>{withdrawal.playerId}</td>
                          <td>${withdrawal.amount}</td>
                          <td>{withdrawal.method}</td>
                          <td>
                            <span className="status completed">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
