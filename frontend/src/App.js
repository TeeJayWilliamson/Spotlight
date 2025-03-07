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
import Checkout from './components/Checkout'; // Import the Checkout component
import Kpi from './components/Kpi'; // Adjust the path if needed
import { UserProvider } from './UserContext'; // Import UserProvider
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [cart, setCart] = useState([]); // Add cart state

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
    setCart([]); // Clear cart on logout
  };

  return (
    <UserProvider>
      <Router>
        <Header isAuthenticated={isAuthenticated} username={username} handleLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login setAuth={setIsAuthenticated} setUsername={setUsername} />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          <Route path="/badges" element={isAuthenticated ? <Badges /> : <Navigate to="/login" />} />
          <Route path="/rewards" element={isAuthenticated ? <Rewards cart={cart} setCart={setCart} /> : <Navigate to="/login" />} />
          <Route path="/scorecard" element={isAuthenticated ? <Scorecard /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={isAuthenticated ? <Checkout cart={cart} setCart={setCart} /> : <Navigate to="/login" />} />
          <Route path="/kpi" element={isAuthenticated ? <Kpi /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
