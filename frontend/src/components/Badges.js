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

  // Filter users based on the search query
  const filteredUsers = users.filter((user) => {
    const username = user.username ? user.username.toLowerCase() : '';
    const name = user.name ? user.name.toLowerCase() : '';
    return (
      username.includes(searchQuery.toLowerCase()) ||
      name.includes(searchQuery.toLowerCase())
    );
  });

  // Handle user selection from suggestions list
  const handleUserClick = (user) => {
    if (!selectedUsers.some(u => u.username === user.username)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery(''); // Clear the search input once user is selected
  };

  // Handle removal of selected user
  const handleRemoveUser = (username) => {
    setSelectedUsers(selectedUsers.filter(user => user.username !== username));
  };

  // Handle sending the badge
  const handleSend = () => {
    // Handle send functionality here
    console.log("Sending badge to:", selectedUsers);
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
        {/* Search Input Box */}
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        
        {/* User Suggestions Dropdown */}
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

        {/* Display selected users */}
        {selectedUsers.length > 0 && (
          <div className="selected-users">
            <h4>Selected Users:</h4>
            <ul>
              {selectedUsers.map((user) => (
                <li key={user.username}>
                  <span>{user.username} - {user.name}</span>
                  <button onClick={() => handleRemoveUser(user.username)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Badge sending area */}
      <div className="badge-action">
        <h4>Send Badge</h4>
        {/* Badge Type and Message (Example) */}
        <div>
          <label>Badge Type:</label>
          <input
            type="text"
            value={badgeType}
            onChange={(e) => setBadgeType(e.target.value)} 
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
          />
        </div>
        
        {/* Send Button */}
        <button onClick={handleSend}>Send Badge</button>
      </div>
    </div>
  );
}

export default Badges;
