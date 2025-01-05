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

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl.replace(/\/$/, '')}/login`, {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('name', response.data.name);

      if (keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'true');
      }

      setAuth(true);
      setUsername(username);

      navigate('/home');
    } catch (err) {
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
              <input className="keep-logged-in"
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
        {/* Add your image or logo here */}
        <img src={require('../img/ttc1.jpg')} alt="Logo or background" />
      </div>
    </div>
  );
}

export default Login;
