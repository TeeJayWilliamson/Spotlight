import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Badges() {
  const [badges, setBadges] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [message, setMessage] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    axios
      .get(`${apiUrl.replace(/\/$/, '')}/badges`)
      .then((response) => {
        setBadges(response.data);
      })
      .catch((error) => {
        console.error("Error fetching badges:", error);
      });

    axios
      .get(`${apiUrl}/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [apiUrl]);

  const filteredUsers = users.filter((user) => {
    const username = user.username ? user.username.toLowerCase() : '';
    const name = user.name ? user.name.toLowerCase() : '';
    return (
      username.includes(searchQuery.toLowerCase()) ||
      name.includes(searchQuery.toLowerCase())
    );
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSearchQuery('');
  };

  const handleBadgeSelect = (badge) => {
    setSelectedBadge(badge);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="badges-container">
      <h2>Badges</h2>
      <div className="divider"></div>

      <h3>Who do you want to shine the Spotlight on?</h3><br></br>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {searchQuery && (
          <div className="user-suggestions">
            <ul>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li key={user.username} onClick={() => handleUserClick(user)}>
                    <span>{user.username}</span> - <span>{user.name}</span>
                  </li>
                ))
              ) : (
                <li>No users found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="recipient-info">
          <p><strong>Recipients: </strong>{selectedUser.name}</p>
        </div>
      )}

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
            <p>No badges available</p>
          )}
        </div>
      </div>

      <div className="message-box">
        <label htmlFor="message">Write a Personalized Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Write a message to accompany the Spotlight..."
        />
      </div>

      <button className="send-spotlight-btn">
        Send Spotlight Recognition
      </button>
    </div>
  );
}

export default Badges;
