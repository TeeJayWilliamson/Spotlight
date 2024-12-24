import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Users from './components/Users';
import Badges from './components/Badges';
import Rewards from './components/Rewards';
import Scorecard from './components/Scorecard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} username={username} handleLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} setUsername={setUsername} />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
        <Route path="/badges" element={isAuthenticated ? <Badges /> : <Navigate to="/login" />} />
        <Route path="/rewards" element={isAuthenticated ? <Rewards /> : <Navigate to="/login" />} />
        <Route path="/scorecard" element={isAuthenticated ? <Scorecard /> : <Navigate to="/login" />} />
        {/* Default route points to /home */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
