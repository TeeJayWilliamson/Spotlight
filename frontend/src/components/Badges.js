import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import './Profile.css';
import './Badges.css';

function Badges() {
  const [badgeType, setBadgeType] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [pointBalance, setPointBalance] = useState(1000);
  const [recognizeNow, setRecognizeNow] = useState(5000);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    axios.get(`${apiUrl}users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    const username = localStorage.getItem('username');
    if (username) {
      axios
        .get(`${apiUrl}user/${username}`)
        .then((response) => {
          setName(response.data.name);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  }, []);

  const handleBadgeTypeChange = (event) => {
    setBadgeType(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (badgeType && message && recipient) {
      console.log('Badge Type:', badgeType);
      console.log('Message:', message);
      console.log('Recipient:', recipient);

      axios.post(`${apiUrl}send-badge`, {
        badgeType,
        message,
        recipient,
      }).then((response) => {
        console.log('Badge sent successfully:', response.data);
      }).catch((error) => {
        console.error('Error sending badge:', error);
      });
    } else {
      console.log('Please fill in all fields.');
    }
  };

  return (
    <div className="home-container">
      <div className="left-pane">
        <div className="user-info">
          <h3>{name.split(' ')[0]}'s Account</h3>
        </div>
        <div className="divider"></div>
        <div className="badge-selection">
          <label htmlFor="badgeType">Choose an Emblem:</label>
          <select id="badgeType" value={badgeType} onChange={handleBadgeTypeChange}>
            <option value="">Select Badge Type</option>
            <option value="Teamwork">Teamwork</option>
            <option value="Leadership">Leadership</option>
            <option value="Creativity">Creativity</option>
            <option value="Dedication">Dedication</option>
          </select>
        </div>
        <div className="divider"></div>
        <div className="balance-info">
          <p className="label">Point Balance:</p>
          <p className="large-number">{pointBalance}</p>
        </div>
      </div>

      <div className="center-pane">
        <h2>Who do you want to shine a spotlight on?</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="recipient">Recipient:</label>
            <select id="recipient" value={recipient} onChange={handleRecipientChange}>
              <option value="">Select Recipient</option>
              {users.map((user, index) => (
                <option key={index} value={user.username}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message">Personalized Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              placeholder="Enter your message"
            />
          </div>
          <button type="submit">Send Emblem</button>
        </form>
      </div>

      <div className="right-pane">
        <div className="recognize-info">
          <p className="label">Recognize Now:</p>
          <p className="large-number">{recognizeNow}</p>
        </div>
        <div className="divider"></div>
        <div className="request-budget">
          <button className="request-budget-btn">Request More Budget</button>
        </div>
      </div>
    </div>
  );
}

export default Badges;
