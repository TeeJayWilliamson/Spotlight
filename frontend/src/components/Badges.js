// Badges.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Lightbox from './Lightbox'; // Import the lightbox component
import './Profile.css';
import './Badges.css';
import '../App.css';
import { NewsFeedContext } from './NewsFeedContext';

function Badges() {
  const { addNewsItem } = useContext(NewsFeedContext);
  const [badgeType, setBadgeType] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState([]);
  const [pointBalance, setPointBalance] = useState(1000);
  const [recognizeNow, setRecognizeNow] = useState(5000);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // State for managing lightbox visibility
  const [selectedEmblem, setSelectedEmblem] = useState(null); // State for selected emblem

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
    selectedUsers.forEach((user) => {
      const newsItem = {
        name: 'Current User', // Replace with the current user's name
        action: 'sent a Spotlight recognition to',
        recipient: user.name,
        reason: message,
        time: 'Just now',
      };
      addNewsItem(newsItem);
    });

    // Clear the inputs after sending
    setBadgeType('');
    setMessage('');
    setSelectedUsers([]);
    setSelectedEmblem(null);
    setIsPrivate(false);
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

      {/* Right Pane - User and Message Form */}
      <div className="recognition-form">
        <h2>Recognize Your Colleagues</h2>
        <div className="recipient-section">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="suggestions">
            {filteredUsers.map((user) => (
              <div key={user.username} className="suggestion-item" onClick={() => handleUserClick(user)}>
                {user.name} ({user.username})
              </div>
            ))}
          </div>
          <div className="selected-users">
            {selectedUsers.map((user) => (
              <div key={user.username} className="selected-user">
                {user.name} <button onClick={() => handleRemoveUser(user.username)}>x</button>
              </div>
            ))}
          </div>
        </div>

        <div className="message-section">
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="private-checkbox">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <label htmlFor="private">Keep recognition private</label>
        </div>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Badges;
