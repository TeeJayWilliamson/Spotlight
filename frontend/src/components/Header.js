import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';
import './Header.css';
import spotlightLogo from '../img/spotlightlogo.png';

function Header({ handleLogout }) {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isManagement, setIsManagement] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate hook
  const isLoginPage = location.pathname === '/login';

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (username) {
      const userUrl = new URL(`user/${username}`, apiUrl);
      axios
        .get(userUrl.toString())
        .then((response) => {
          setName(response.data.name);
          setProfileImage(response.data.profileImage);
          setIsAuthenticated(true);
          setIsManagement(response.data.isManagement || false); // Set isManagement flag
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
          setIsAuthenticated(false);
        });
    } else {
      setName('');
      setProfileImage('');
      setIsAuthenticated(false);
      setIsManagement(false);
    }
  }, [apiUrl, location.pathname]);

  const handleLogoutClick = () => {
    handleLogout();
    setName('');
    setProfileImage('');
    setIsAuthenticated(false);
    setIsManagement(false);
    localStorage.removeItem('username');
    navigate('/login'); // Navigate to the login page after logging out
  };

  return (
    <header className="site-header">
      <nav className="navbar-purple">
        <div className="navbar-container">
          <ul className="navbar-nav">
            <Link to="/home">
              <img
                src={spotlightLogo}
                alt="Spotlight Logo"
                className="navbar-spotlight-logo"
              />
            </Link>
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
                    <i className="bx bxs-bulb bx-sm lightbulb-icon"></i>
                    <span>Newsfeed</span>
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/users" className="navbar-link">
                    <i className="bx bxs-user bx-sm user-icon"></i>
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
                  <Link to="/checkout" className="navbar-link">
                    <i className="bx bxs-cart-alt bx-sm"></i>
                    <span>Cart</span>
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/scorecard" className="navbar-link">
                    <i className="bx bxs-report bx-sm"></i>
                    <span>Scorecard</span>
                  </Link>
                </li>
                {isManagement && ( // Conditionally render KPI item
                  <li className="navbar-item">
                    <Link to="/kpi" className="navbar-link">
                      <i className="bx bxs-chart bx-sm"></i>
                      <span>KPI</span>
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {isAuthenticated && (
            <ul className="navbar-nav navbar-right">
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link-profile">
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="header-profile-image"
                    />
                  )}
                  {name.split(' ')[0]}
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogoutClick} className="logout-button">
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
