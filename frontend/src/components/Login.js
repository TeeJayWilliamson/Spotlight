import React, { useState, useContext } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Login({ setAuth, setUsername }) {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  
  const { 
    setUser, 
    setPointBalance, 
    setRecognizeNowBalance, 
    setIsManagement 
  } = useContext(UserContext);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Use the correct auth route that matches your backend
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email, // Your backend expects email, not username
        password,
      });

      const { token, userId } = response.data;
      
      // Store token and userId
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email); // Store email instead of username

      if (keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'true');
      }

      // Get user profile after successful login
      try {
        const profileResponse = await axios.get(`${apiUrl}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = profileResponse.data;
        setUser(userData);
        setPointBalance(userData.currentPointBalance || 0);
        setRecognizeNowBalance(userData.recognizeNowBalance || 0);
        setIsManagement(userData.isManagement || false);
      } catch (profileError) {
        console.warn('Could not fetch user profile:', profileError);
        // Continue with login even if profile fetch fails
      }

      setShowTerms(true);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const handleAgree = () => {
    setAuth(true);
    setUsername(email); // Pass email as username for compatibility
    setShowTerms(false);
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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