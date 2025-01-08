import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      const userUrl = new URL(`user/${username}`, apiUrl);
      axios.get(userUrl.toString())
        .then(response => {
          setCurrentUser(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching current user:', error);
        });
    }

    const usersUrl = new URL('users', apiUrl);
    axios.get(usersUrl.toString())
      .then(response => {
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

  const handleSend = async () => {
    if (!selectedEmblem || selectedUsers.length === 0 || !message) {
      alert('Please select an emblem, recipients, and write a message');
      return;
    }

    setSending(true);

    try {
      const newPost = {
        name: currentUser,
        emblem: {
          title: selectedEmblem.title,
          image: selectedEmblem.image
        },
        recipients: selectedUsers.map(user => user.name),
        message: message,
        isPrivate: isPrivate
      };

      const postsUrl = new URL('posts', apiUrl);
      await axios.post(postsUrl.toString(), newPost);

      setSelectedEmblem(null);
      setSelectedUsers([]);
      setMessage('');
      setIsPrivate(false);

      alert('Recognition sent successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error sending recognition:', error);
      alert('Failed to send recognition. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleEmblemSelect = (emblem) => {
    setSelectedEmblem(emblem);
    setIsLightboxOpen(false);
  };

  return (
    <div className="badges-container">
      <div className="emblem-selector">
        <h3>{selectedEmblem ? selectedEmblem.title : 'Choose an Emblem'}</h3>
        <div className="circle-button" onClick={() => setIsLightboxOpen(true)}>
          <img
            src={selectedEmblem ? selectedEmblem.image : require('../img/emblem.png')}
            alt={selectedEmblem ? selectedEmblem.title : 'Add Emblem'}
          />
        </div>
      </div>

      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelect={handleEmblemSelect}
      />

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
          <button 
            onClick={handleSend} 
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

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
