import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setAuth, setUsername }) {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Set the API URL to use Heroku in production or localhost in development
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';  // Default to localhost for development

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl.replace(/\/$/, '')}/login`, {
        username,
        password,
      });

      // Store the received token, username, and full name in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('name', response.data.name); // Storing the full name
    
      setAuth(true);
      setUsername(username);

      navigate('/home');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
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
            <label className="keep-logged-in">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
              Keep me logged in
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="login-image">
        <img src="your-image-url.jpg" alt="Login visual" />
      </div>
    </div>
  );
}

export default Login;
