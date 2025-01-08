import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';
import './Header.css';
import spotlightLogo from '../img/spotlightlogo.png';

function Header({ handleLogout }) {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

  useEffect(() => {
    const username = localStorage.getItem('username');
  
    if (username) {
      const userUrl = new URL(`user/${username}`, apiUrl);
      axios
        .get(userUrl.toString())
        .then((response) => {
          setName(response.data.name);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
          setIsAuthenticated(false);
        });
    } else {
      setName('');
      setIsAuthenticated(false);
    }
  }, [apiUrl, location.pathname]);
  

  const handleLogoutClick = () => {
    handleLogout();
    setName('');
    setIsAuthenticated(false);
    localStorage.removeItem('username');
  };

  return (
    <>
    <nav className="navbar-purple">
      <div className="navbar-container">
        <ul className="navbar-nav">
        <img src={spotlightLogo} alt="Spotlight Logo" className="navbar-spotlight-logo" />
        </ul>
      </div>
    </nav>



      <nav className="navbar-red">
        <div className="navbar-container">
          <ul className="navbar-nav">


            {!isLoginPage && (
              <>
                <li className="navbar-item">
                  <Link to="/" className="navbar-link">
                    <FontAwesomeIcon icon={faLightbulb} className="lightbulb-icon" />
                    <span>Newsfeed</span>
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/users" className="navbar-link">
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    <span>Users</span>
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/badges" className="navbar-link">
                    <i className="bx bxs-badge-check badge-icon"></i>
                    <span>Recognize</span>
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
                    <i className="bx bxs-report bx-sm"></i>
                    <span>Scorecard</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

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


    </>
  );
}

export default Header;
