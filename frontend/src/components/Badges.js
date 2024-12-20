import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Badges() {
  const [badges, setBadges] = useState([]);
  const [users, setUsers] = useState([]); // To hold user data for search
  const [selectedUser, setSelectedUser] = useState(null); // The user selected for spotlight
  const [selectedBadge, setSelectedBadge] = useState(null); // The selected badge
  const [message, setMessage] = useState(''); // Message to go with the spotlight

  // API URL from the environment variable
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Fallback URL for local dev

  // Fetch badges and users
  useEffect(() => {
    // Fetch badges
    axios
      .get(`${API_URL}/badges`) // Use the live API or fallback URL
      .then((response) => {
        setBadges(response.data);
      })
      .catch((error) => {
        console.error("Error fetching badges:", error);
      });

    // Fetch users for the search dropdown
    axios
      .get(`${API_URL}/users`) // Use the live API or fallback URL
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [API_URL]);

  // Handle user selection from the dropdown
  const handleUserSelect = (e) => {
    const selected = users.find(user => user.username === e.target.value);
    setSelectedUser(selected);
  };

  // Handle badge selection
  const handleBadgeSelect = (badge) => {
    setSelectedBadge(badge);
  };

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="badges-container">
      <h2>Badges</h2>
      <div className="divider"></div>

      {/* Header */}
      <h3>Who do you want to shine the Spotlight on?</h3><br></br>

      {/* User Search Dropdown */}
      <div className="user-search">
        <label htmlFor="user-select">Search for a Recipient: </label>
        <input
          type="text"
          id="user-select"
          list="user-options"
          onChange={handleUserSelect}
          placeholder="Start typing a username..."
        />
        <datalist id="user-options">
          {users.map((user) => (
            <option key={user.username} value={user.username}>
              {user.name} ({user.username})
            </option>
          ))}
        </datalist>
      </div>

      {/* Recipients Display */}
      {selectedUser && (
        <div className="recipient-info">
          <p><strong>Recipients: </strong>{selectedUser.name}</p>
        </div>
      )}

      {/* Badge Selection */}
      <div className="badge-selection">
        <h4>Choose a Badge</h4>
        <div className="badge-placeholder" onClick={() => handleBadgeSelect(null)}>
          {selectedBadge ? (
            <img src={selectedBadge.image} alt={selectedBadge.name} />
          ) : (
            <p>Select a badge image</p>
          )}
        </div>
        <div className="badge-options">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="badge-option"
              onClick={() => handleBadgeSelect(badge)}
            >
              <img src={badge.image} alt={badge.name} />
              <p>{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Message */}
      <div className="message-box">
        <label htmlFor="message">Write a Personalized Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Write a message to accompany the Spotlight..."
        />
      </div>

      {/* Button to Send Spotlight */}
      <button className="send-spotlight-btn">
        Send Spotlight Recognition
      </button>
    </div>
  );
}

export default Badges;
