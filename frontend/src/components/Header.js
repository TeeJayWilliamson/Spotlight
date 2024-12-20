import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';
import '../App.css';

function Header({ handleLogout }) {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Import useLocation to get the current route
  const isLoginPage = location.pathname === '/login'; // Check if we're on the login page

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    const username = localStorage.getItem('username'); // Retrieve username from localStorage

    if (username) {
      // Make an API call to fetch user info from the backend
      axios
        .get(`${apiUrl}user/${username}`) // Use the apiUrl for the API route
        .then((response) => {
          setName(response.data.name); // Set the full name in the state
          setIsAuthenticated(true); // Assume user is authenticated if API call is successful
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
          setIsAuthenticated(false); // In case of error, assume not authenticated
        });
    } else {
      // Clear state if no username is found in localStorage
      setName('');
      setIsAuthenticated(false);
    }
  }, [apiUrl]); // This effect will rerun if the apiUrl changes, but not based on username changes

  const handleLogoutClick = () => {
    handleLogout();
    setName(''); // Clear the name state
    setIsAuthenticated(false); // Clear the authentication state
    localStorage.removeItem('username'); // Optionally remove username from localStorage
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-nav">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              <FontAwesomeIcon icon={faLightbulb} className="lightbulb-icon" />
              <span>Spotlight</span>
            </Link>
          </li>

          {/* Conditionally render these items only if not on the login page */}
          {!isLoginPage && (
            <>
              <li className="navbar-item">
                <Link to="/users" className="navbar-link">
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                  <span>Users</span>
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/badges" className="navbar-link">
                  <i className="bx bxs-badge-check badge-icon"></i>
                  <span>Emblem</span>
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/rewards" className="navbar-link">
                  <i className="bx bxs-gift gift-icon"></i>
                  <span>Rewards</span>
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/scorecard" className="navbar-link">
                  <i className='bx bxs-report bx-sm'></i>
                  <span>Scorecard</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Show profile and logout only if the user is authenticated */}
        {isAuthenticated && (
          <ul className="navbar-nav navbar-right">
            <li className="navbar-item">
              <Link to="/profile" className="navbar-link-profile">{name.split(' ')[0]}</Link>
            </li>
            <li className="navbar-item">
              <button onClick={handleLogoutClick} className="logout-button">Logout</button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Header;
