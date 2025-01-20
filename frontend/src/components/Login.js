import React, { useState, useContext } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext

function Login({ setAuth, setUsername }) {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Destructure context setters
  const { 
    setUser, 
    setPointBalance, 
    setRecognizeNowBalance, 
    setIsManagement 
  } = useContext(UserContext);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl.replace(/\/$/, '')}/login`, {
        username,
        password,
      });

      // Log response data for debugging
      console.log('Login response:', response.data);

      // Maintain existing localStorage logic
      const { token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', response.data.userId || ''); // Maintain existing userId storage
      localStorage.setItem('username', username);

      if (keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'true');
      }

      // Keep existing authentication method
      setAuth(true);
      setUsername(username);

      // Additionally update UserContext
      if (response.data.user) {
        setUser(response.data.user);
        setPointBalance(response.data.user.currentPointBalance || 0);
        setRecognizeNowBalance(response.data.user.recognizeNowBalance || 0);
        setIsManagement(response.data.user.isManagement || false);
      }

      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <div className="additional-options">
            <a href="#" className="forgot-details">Forgot your details?</a>
            <label>
              <input 
                className="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
              <span>Keep me logged in</span>
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="login-image">
        <img src={require('../img/ttc1.png')} alt="Logo or background" />
      </div>
    </div>
  );
}

export default Login;
