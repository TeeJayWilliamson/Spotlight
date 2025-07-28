import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Lightbox from './Lightbox';
import { UserContext } from '../UserContext';
import './Profile.css';
import './Badges.css';
import '../App.css';

const presetMessages = [
  "Thank you for your outstanding contribution to the team!",
  "Great job on delivering exceptional results!",
  "Your dedication and hard work are truly appreciated.",
  "Thank you for going above and beyond in your work.",
  "Your positive attitude makes such a difference to our team.",
  "Excellent work on the recent project completion!",
  "Your leadership and initiative are truly valued.",
  "Thank you for being such a supportive team member.",
  "Your innovative thinking helped solve a complex challenge.",
  "Outstanding demonstration of our company values!"
];

const MessageInput = ({ message, handleMessageChange, isManagement }) => {
  if (isManagement) {
    return (
      <div className="message-container">
        <h3>Personalized Message:</h3>
        <p>Max 1000 characters</p>
        <textarea
          value={message}
          onChange={handleMessageChange}
          maxLength="1000"
          placeholder="Write your message here..."
          rows="6"
          className="w-full p-2 border rounded"
        />
      </div>
    );
  }
  return (
    <div className="message-container">
      <h3>Select a Recognition Message:</h3>
      <select
        value={message}
        onChange={handleMessageChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select a message...</option>
        {presetMessages.map((msg, index) => (
          <option key={index} value={msg}>
            {msg}
          </option>
        ))}
      </select>
    </div>
  );
};

function Badges() {
  const { recognizeNowBalance, setRecognizeNowBalance, pointBalance, setPointBalance, user } = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(user);
  const [badgeType, setBadgeType] = useState('Free Recognition');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedEmblem, setSelectedEmblem] = useState(null);
  const [sending, setSending] = useState(false);
  const [pointValue, setPointValue] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-fq6lakcb2-teejaywilliamsons-projects.vercel.app';

  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedUsers([location.state.selectedUser]);
    }
  }, [location]);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      const userUrl = new URL(`user/${username}`, apiUrl);
      axios.get(userUrl.toString())
        .then(response => {
          setCurrentUser(response.data);
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

  const handleUserClick = useCallback((user) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers(prevUsers => [...prevUsers, user]);
    }
    setSearchQuery('');
  }, [selectedUsers]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handlePointValueChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPointValue(value);
  };

  const handleSend = useCallback(async () => {
    if (!selectedEmblem || selectedUsers.length === 0 || !message) {
      alert('Please select an emblem, recipients, and message');
      return;
    }

    if (badgeType === 'Point Recognition') {
      if (!pointValue || pointValue <= 0) {
        alert('Please enter a valid point value for point recognition');
        return;
      }

      const pointsToSend = parseInt(pointValue) * selectedUsers.length;
      if (pointsToSend > recognizeNowBalance) {
        alert(`Insufficient RecognizeNow balance. You need ${pointsToSend} points but have ${recognizeNowBalance}`);
        return;
      }
    }

    setSending(true);
    const token = localStorage.getItem('token');

    try {
      if (badgeType === 'Point Recognition') {
        // Handle point transfer
        const pointTransferResponse = await axios.post(
          `${apiUrl}/api/point-transfer`,
          {
            senderUsername: currentUser.username,
            recipients: selectedUsers.map(user => user.username),
            pointAmount: parseInt(pointValue)
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (pointTransferResponse.data.newSenderBalance !== undefined) {
          setRecognizeNowBalance(pointTransferResponse.data.newSenderBalance);
        }
      }

      // Create recognition post
      const newPost = {
        name: currentUser.name,
        emblem: {
          title: selectedEmblem.title,
          image: selectedEmblem.image,
        },
        recipients: selectedUsers.map((user) => user.name),
        message: message,
        isPrivate: isPrivate,
        recognitionType: badgeType,
        pointValue: badgeType === 'Point Recognition' ? parseInt(pointValue) : null,
      };

      await axios.post(
        `${apiUrl}/posts`,
        newPost,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      

      // Reset form
      setSelectedEmblem(null);
      setSelectedUsers([]);
      setMessage('');
      setIsPrivate(false);
      setBadgeType('Free Recognition');
      setPointValue('');

      alert('Recognition sent successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error sending recognition:', error);
      alert(error.response?.data?.message || 'Failed to send recognition. Please try again.');
    } finally {
      setSending(false);
    }
  }, [
    selectedEmblem,
    selectedUsers,
    message,
    isPrivate,
    badgeType,
    pointValue,
    currentUser,
    apiUrl,
    navigate,
    recognizeNowBalance,
    setRecognizeNowBalance
  ]);

  const handleEmblemSelect = useCallback((emblem) => {
    setSelectedEmblem(emblem);
    setIsLightboxOpen(false);
  }, []);

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
            className="w-full p-2 border rounded"
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
          {selectedUsers.map((user) => (
            <div key={user.username} className="user-box">
              <span>{user.name}</span>
              <span
                className="remove-user"
                onClick={() =>
                  setSelectedUsers(selectedUsers.filter((u) => u.username !== user.username))
                }
              >
                &times;
              </span>
            </div>
          ))}
        </div>

        <div className="divider-emblem" />

        <MessageInput 
          message={message}
          handleMessageChange={handleMessageChange}
          isManagement={currentUser?.isManagement}
        />

        <div className="flex items-center space-x-6 mt-4">
          <button
            onClick={handleSend}
            disabled={sending}
            className="button"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>

          {currentUser?.isManagement && (
            <div className="flex items-center space-x-6 ml-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="freeRecognition"
                    name="recognitionType"
                    value="Free Recognition"
                    checked={badgeType === 'Free Recognition'}
                    onChange={(e) => {
                      setBadgeType(e.target.value);
                      setPointValue('');
                    }}
                  />
                  <label htmlFor="freeRecognition">Free Recognition</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="pointRecognition"
                    name="recognitionType"
                    value="Point Recognition"
                    checked={badgeType === 'Point Recognition'}
                    onChange={(e) => setBadgeType(e.target.value)}
                  />
                  <label htmlFor="pointRecognition">Point Recognition</label>
                </div>

                {badgeType === 'Point Recognition' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={pointValue}
                      onChange={handlePointValueChange}
                      placeholder="Points"
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

<div className="right-pane">
  {currentUser?.isManagement && (
    <div className="recognize-now-balance">
      <p className="label">Remaining Points this Month</p>
      <p className="large-number">{recognizeNowBalance}</p>
    </div>
  )}
  <div className="divider" />
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={isPrivate}
      onChange={() => setIsPrivate(!isPrivate)}
    />
    <span>Private</span>
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