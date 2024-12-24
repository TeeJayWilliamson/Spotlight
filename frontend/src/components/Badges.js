import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lightbox from './Lightbox';
import './Profile.css';
import './Badges.css';
import '../App.css';

function Badges() {
  const [currentUser, setCurrentUser] = useState('');
  const [badgeType, setBadgeType] = useState('');
  const [message, setMessage] = useState('');
  const [pointBalance, setPointBalance] = useState(1000);
  const [recognizeNow, setRecognizeNow] = useState(5000);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedEmblem, setSelectedEmblem] = useState(null);
  const [sending, setSending] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    // Fetch current user
    const username = localStorage.getItem('username');
    if (username) {
      axios.get(`${apiUrl}user/${username}`)
        .then(response => {
          console.log('Current user response:', response.data);
          setCurrentUser(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching current user:', error);
        });
    }

    // Fetch all users
    axios.get(`${apiUrl}users`)
      .then(response => {
        console.log('Users response:', response.data);
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
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
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery('');
  };

  const handleSendEmblem = async () => {
    if (!selectedEmblem || selectedUsers.length === 0 || !message) {
      alert('Please fill in all the details.');
      return;
    }

    setSending(true);

    const newPost = {
      name: currentUser,
      recipients: selectedUsers.map(user => user.name),
      emblem: selectedEmblem,
      message: message,
      isPrivate: isPrivate,
      timestamp: new Date().toISOString()
    };

    try {
      await axios.post(`${apiUrl}posts`, newPost);
      alert('Emblem sent successfully!');
    } catch (error) {
      console.error('Error sending emblem:', error);
      alert('Failed to send emblem.');
    } finally {
      setSending(false);
      setSelectedUsers([]);
      setBadgeType('');
      setMessage('');
      setIsLightboxOpen(false);
    }
  };

  return (
    <div className="badges-container">
      <h2>Send a Spotlight</h2>
      <div className="form-group">
        <label htmlFor="badgeType">Select Badge Type</label>
        <select
          id="badgeType"
          value={badgeType}
          onChange={(e) => setBadgeType(e.target.value)}
        >
          <option value="">Select a badge type</option>
          <option value="Thank You">Thank You</option>
          <option value="Great Job">Great Job</option>
          <option value="Outstanding Performance">Outstanding Performance</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
        />
      </div>
      <div className="form-group">
        <label htmlFor="searchQuery">Search Users</label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username or name"
        />
        <ul className="search-results">
          {filteredUsers.map((user) => (
            <li key={user._id} onClick={() => handleUserClick(user)}>
              {user.name} ({user.username})
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group">
        <label>Selected Users</label>
        <ul>
          {selectedUsers.map((user) => (
            <li key={user._id}>
              {user.name} ({user.username})
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group">
        <label htmlFor="private">Private</label>
        <input
          type="checkbox"
          id="private"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
      </div>
      <div className="form-group">
        <button onClick={() => setIsLightboxOpen(true)}>Select Emblem</button>
        {selectedEmblem && (
          <div>
            <p>Selected Emblem: {selectedEmblem.title}</p>
            <img src={selectedEmblem.image} alt={selectedEmblem.title} />
          </div>
        )}
      </div>
      <button onClick={handleSendEmblem} disabled={sending}>
        {sending ? 'Sending...' : 'Send Emblem'}
      </button>

      {isLightboxOpen && (
        <Lightbox
          onClose={() => setIsLightboxOpen(false)}
          onSelectEmblem={(emblem) => setSelectedEmblem(emblem)}
        />
      )}
    </div>
  );
}

export default Badges;
