import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Badges from './components/Badges';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set default authorization header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';
          const response = await axios.get(`${apiUrl}verify-token`);
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <NavBar />}
        <div className="content">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/badges" 
              element={
                <ProtectedRoute>
                  <Badges />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" /> : 
                <Login setIsAuthenticated={setIsAuthenticated} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/" /> : 
                <Register />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;