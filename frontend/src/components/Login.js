import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Login({ setAuth, setUsername }) {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    setUser, 
    setPointBalance, 
    setRecognizeNowBalance, 
    setIsManagement 
  } = useContext(UserContext);

  // Use environment variable or fallback to same origin (for production)
  const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { username, apiUrl });
      
      // Use same-origin requests when possible
      const loginUrl = apiUrl === window.location.origin ? '/login' : `${apiUrl}/login`;
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Important for same-origin requests
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Login failed with response:', errorData);
        throw new Error(`Login failed`);
      }

      const data = await response.json();
      console.log('Login success data:', data);

      const { token } = data;
      
      // Store token and username
      localStorage.setItem('token', token);
      localStorage.setItem('userId', data.userId || '');
      localStorage.setItem('username', username);

      if (keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'true');
      }

      // Use the user data from the login response
      if (data.user) {
        setUser(data.user);
        setPointBalance(data.user.currentPointBalance || 0);
        setRecognizeNowBalance(data.user.recognizeNowBalance || 0);
        setIsManagement(data.user.isManagement || false);
      }

      setShowTerms(true);
    } catch (err) {
      console.error('Login error details:', err);
      // Don't show error to user - just log it
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgree = () => {
    setAuth(true);
    setUsername(username);
    setShowTerms(false);
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <div className="additional-options">
            <button type="button" className="forgot-details">Forgot your details?</button>
            <label>
              <input 
                className="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                disabled={isLoading}
              />
              <span>Keep me logged in</span>
            </label>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <div className="login-image">
        <img src={require('../img/ttc1.png')} alt="Logo or background" />
      </div>

      {showTerms && (
        <div className="terms-modal-overlay">
          <div className="terms-modal">
            <h3>User Agreement</h3>
            <div className="terms-content">
              <div className="terms-section">
                <div className="divider-top"></div>
                <h4>Spotlight: A Recognition Platform</h4>
                <p>
                  Spotlight is a rewards and recognition platform designed to foster a positive and respectful environment where members can recognize their peers for outstanding work. Through the platform, management can reward individuals with recognition and points, which can be redeemed for gift cards. The site promotes a culture of appreciation while adhering to strict guidelines to prevent bullying, favoritism, or any form of discriminatory behavior, ensuring that everyone is treated with dignity and respect.
                </p>
              </div>
              <div className="terms-section">
                <div className="divider-top"></div>
                <h4>Respect and Dignity Policy Overview</h4>
                <p>
                  The TTC's Respect and Dignity Policy ensures a workplace that is free from harassment, discrimination, and bullying. It aims to uphold the dignity, self-worth, and human rights of every individual, and prohibits any behavior that could create a hostile or discriminatory environment. This policy applies to all employees, contractors, and customers, and includes clear procedures for reporting and addressing harassment or discrimination.
                </p>
                <p>
                  For full details, please refer to the <a href="https://www.ttc.ca/transparency-and-accountability/policies/Materials-and-Procurement-Policies/respect-and-dignity-policy" target="_blank" rel="noopener noreferrer">Respect and Dignity Policy</a>.
                </p>
              </div>
            </div>
            <button onClick={handleAgree}>Agree & Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;