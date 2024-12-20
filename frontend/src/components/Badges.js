import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import './badges.css';

function Badges() {
  const [badges, setBadges] = useState([]);
  const [users, setUsers] = useState([]); // To hold user data for search
  const [selectedUser, setSelectedUser] = useState(null); // The user selected for spotlight
  const [selectedBadge, setSelectedBadge] = useState(null); // The selected badge
  const [message, setMessage] = useState(''); // Message to go with the spotlight

  // Set the API URL to use Heroku in production
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    // Fetch badges
    axios
      .get(`${apiUrl.replace(/\/$/, '')}/badges`) // Use the live API or fallback URL
      .then((response) => {
        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setBadges(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching badges:", error);
      });

    // Fetch users for the search dropdown
    axios
      .get(`${apiUrl}/users`) // Use the live API or fallback URL
      .then((response) => {
        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [apiUrl]);

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
      <h2>Emblems</h2>
      <div className="divider"></div>

      <div className="badge-recipient-container">
        {/* Left column: Badge Selection */}
        <div className="badge-selection">
          <h4>Choose an Emblem</h4>
          <div className="badge-placeholder" onClick={() => handleBadgeSelect(null)}>
            {selectedBadge ? (
              <img src={selectedBadge.image} alt={selectedBadge.name} />
            ) : (
              <p>Select an emblem image</p>
            )}
          </div>
          <div className="badge-options">
            {Array.isArray(badges) && badges.length > 0 ? (
              badges.map((badge) => (
                <div
                  key={badge.id}
                  className="badge-option"
                  onClick={() => handleBadgeSelect(badge)}
                >
                  <img src={badge.image} alt={badge.name} />
                  <p>{badge.name}</p>
                </div>
              ))
            ) : (
              <p>No badges available</p> // Fallback message when no badges are available
            )}
          </div>
        </div>

        {/* Right column: Recipient and Message */}
        <div className="recipient-message">
          <h3>Who do you want to shine the Spotlight on?</h3>

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
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <option key={user.username} value={user.username}>
                    {user.name} ({user.username})
                  </option>
                ))
              ) : (
                <p>No users found</p> // Message when no users are available
              )}
            </datalist>
          </div>

          {/* Recipients Display */}
          {selectedUser && (
            <div className="recipient-info">
              <p><strong>Recipients: </strong>{selectedUser.name}</p>
            </div>
          )}

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
        </div>
      </div>

      {/* Button to Send Spotlight */}
      <button className="send-spotlight-btn">
        Send Spotlight Recognition
      </button>
    </div>
  );
}

export default Badges;
