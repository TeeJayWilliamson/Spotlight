import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import 'boxicons/css/boxicons.min.css';
import '../App.css';

function Header({ isAuthenticated, name, handleLogout }) {
  const location = useLocation(); // Import useLocation to get the current route
  const isLoginPage = location.pathname === "/login"; // Check if we're on the login page

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
                <i class='bx bxs-report bx-sm'></i>
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
              <Link to="/profile" className="navbar-link-profile">{name}</Link>
            </li>
            <li className="navbar-item">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Header;
