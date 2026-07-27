import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PlayerDashboard from './pages/PlayerDashboard';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        // Check if admin
        setIsAdmin(storedUser.toLowerCase().includes('admin') || parsedUser.email?.toLowerCase().includes('admin'));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to={isAdmin ? "/admin" : "/player/dashboard"} /> : <Login setUser={setUser} setToken={setToken} setIsAdmin={setIsAdmin} />
          }
        />
        <Route
          path="/player/dashboard"
          element={
            user && !isAdmin ? (
              <PlayerDashboard user={user} token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminPanel token={token} onLogout={handleLogout} />
            ) : user ? (
              <Navigate to="/player/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
