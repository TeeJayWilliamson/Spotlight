import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lightbox from './Lightbox';
import './Profile.css';
import './Badges.css';
import '../App.css';

function Badges({ setNewsFeed }) {
  const [badgeType, setBadgeType] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState([]);
  const [pointBalance, setPointBalance] = useState(1000);
  const [recognizeNow, setRecognizeNow] = useState(5000);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedEmblem, setSelectedEmblem] = useState(null);

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
    if (selectedUsers.length === 0 || !selectedEmblem) {
      alert('Please select a recipient and an emblem!');
      return;
    }

    // Prepare the data for sending
    const recognitionData = {
      name: 'Your Username',  // Replace with the actual username
      action: 'gave a Spotlight to',  // You can customize this
      recipient: selectedUsers[0].name,
      reason: message,
      time: new Date().toLocaleString(),
    };

    // Call API to save recognition (you might need to adapt this depending on your backend setup)
    axios.post(`${apiUrl}recognition`, recognitionData)
      .then(response => {
        // Update the newsfeed in the parent component
        setNewsFeed(prevFeed => [recognitionData, ...prevFeed]);
        setMessage('');
        setSelectedUsers([]);
        setSelectedEmblem(null);
      })
      .catch(error => {
        console.error('Error sending recognition:', error);
      });
  };

  const handleEmblemSelect = (emblem) => {
    setSelectedEmblem(emblem);
    setIsLightboxOpen(false);
  };

  return (
    <div className="badges-container">
      {/* Left Pane - Emblem Selector */}
      <div className="emblem-selector">
        <h3>{selectedEmblem ? selectedEmblem.title : 'Choose an Emblem'}</h3>
        <div className="circle-button" onClick={() => setIsLightboxOpen(true)}>
          <img
            src={selectedEmblem ? selectedEmblem.image : require('../img/emblem.png')}
            alt={selectedEmblem ? selectedEmblem.title : 'Add Emblem'}
          />
        </div>
      </div>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelect={handleEmblemSelect}
      />

      {/* Middle Pane - Search Bar and User Selection */}
      <div className="search-container">
        <h3>Recipients:</h3>
        <div className="input-dropdown-container">
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
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

        <div className="selected-users">
          {!selectedUsers.length && <div className="empty-placeholder"></div>}
          {selectedUsers.map(user => (
            <div key={user.username} className="user-box">
              <span>{user.name}</span>
              <span className="remove-user" onClick={() => setSelectedUsers(selectedUsers.filter(u => u.username !== user.username))}>
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
        <p>{pointBalance}</p>
        <div className="divider" />
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Private
        </label>
        <div className="divider" />
        <div className="tips-section">
          <h3>Tips:</h3>
          <p>Be specific, be genuine, be concise, be personal, and be timely.</p>
        </div>
      </div>
    </div>
  );
}

export default Badges;
