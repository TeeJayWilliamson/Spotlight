import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import './Badges.css';
import '../App.css';

function Badges() {
  const [badgeType, setBadgeType] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState([]);
  const [pointBalance, setPointBalance] = useState(1000);
  const [recognizeNow, setRecognizeNow] = useState(5000);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
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
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery('');
  };

  const handleRemoveUser = (username) => {
    setSelectedUsers(selectedUsers.filter(user => user.username !== username));
  };

  const handleSend = () => {
    // Handle send functionality here
  };

  return (
    <div className="badges-container">
      {/* Left Pane - Emblem Selector */}
      <div className="emblem-selector">
        <h3>Choose an Emblem</h3>
        <button className="circle-button" onClick={() => { /* Add popup logic here */ }}>+</button>
      </div>

      {/* Middle Pane - Search Bar and User Selection */}
      <div className="search-container">
        <h3>Recipients:</h3>
        
        {/* Input and Suggestions Dropdown Container */}
        <div className="input-dropdown-container">
          {/* Search Input Box */}
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          
          {/* User Suggestions Dropdown */}
          {searchQuery && (
            <div className="user-suggestions-emblem">
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

        {/* Added Recipients Below the Input */}
        <div className="selected-users">
          {/* Placeholder for empty state */}
          {!selectedUsers.length && <div className="empty-placeholder"></div>}

          {selectedUsers.map(user => (
            <div key={user.username} className="user-box">
              <span>{user.name}</span>
              <span 
                className="remove-user" 
                onClick={() => setSelectedUsers(selectedUsers.filter(u => u.username !== user.username))}
              >
                &times;
              </span>
            </div>
          ))}
        </div>

        <div className="divider-emblem" />

        {/* Personalized Message Section */}
        <div className="message-container">
          <h3>Personalized Message:</h3>
          <p>Max 1000 characters</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength="1000"
            placeholder="Write your message here..."
            rows="6"
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>

      {/* Right Pane - Points, Private Checkbox, and Tips */}
      <div className="right-pane">
        <h3>Remaining Points this Month</h3>
        <br></br>
        <p>{pointBalance}</p>

        <br></br>
        <div className="divider" />
        <br></br>
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Private
        </label>
        <div className="divider" />
        <br></br>
        <div className="tips-section">
          <h3>Tips:</h3>
          <p>Be specific, be genuine, be concise, be personal, and be timely.</p>
        </div>
      </div>
    </div>
  );
}

export default Badges;
