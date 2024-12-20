import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import './Badges.css';

function Badges() {
  const [badgeType, setBadgeType] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [pointBalance, setPointBalance] = useState(1000);
  const [recognizeNow, setRecognizeNow] = useState(5000);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    axios.get(`${apiUrl}users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

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

  return (
    <div className="badges-container">
      {/* Left Pane - Emblem Selector */}
      <div className="emblem-selector">
        <h3>Choose an Emblem</h3>
        <button className="circle-button">+</button>
        {/* Add your emblem selection logic here */}
      </div>

      {/* Middle Pane - Search Bar and User Selection */}
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
        {selectedUser && (
          <div className="selected-user">
            <h3>Selected User: {selectedUser.name}</h3>
          </div>
        )}
      </div>

      {/* Right Pane - Points, Private Checkbox, and Tips */}
      <div className="right-pane">
        <h3>Remaining Points this Month</h3>
        <p>{pointBalance}</p>
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Private
        </label>
        <div className="tips-section">
          <h3>Tips:</h3>
          <ul>
            <li>Be specific</li>
            <li>Be genuine</li>
            <li>Be concise</li>
            <li>Be personal</li>
            <li>Be timely</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Badges;
