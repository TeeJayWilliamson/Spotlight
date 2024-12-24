import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Badges from './Badges'; // Import the Badges component

function Home() {
  const [name, setName] = useState('');
  const [newsFeed, setNewsFeed] = useState([
    // Pre-existing news feed items
    {
      name: 'Trevor Williamson',
      action: 'sent a Spotlight recognition to',
      recipient: 'Joseph Sturino',
      reason: 'for outstanding teamwork during the project.',
      time: '2 hours ago',
    },
    // ... other items
  ]);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    const username = localStorage.getItem('username'); // Retrieve username from localStorage

    if (username) {
      // Make an API call to fetch user info from the backend
      axios
        .get(`${apiUrl}user/${username}`)
        .then((response) => {
          setName(response.data.name); // Set the full name in the state
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  }, []);

  // Function to update the news feed when a new recognition is made
  const updateNewsFeed = (recognitionData) => {
    setNewsFeed([recognitionData, ...newsFeed]);
  };

  return (
    <div className="home-container">
      <div className="left-pane">
        <div className="user-info">
          <h3>{name.split(' ')[0]}'s Account</h3> {/* Use first name */}
        </div>
        <div className="divider"></div>
        <div className="balance-info">
          <p className="label">Point Balance:</p>
          <p className="large-number">1000</p>
        </div>
      </div>

      <div className="center-pane">
        <div className="newsfeed">
          <h2>Newsfeed</h2>
          {newsFeed.map((item, index) => (
            <div key={index} className="news-item">
              <p>
                <strong>{item.name}</strong> {item.action} <strong>{item.recipient}</strong><br />
                {item.reason} <em>({item.time})</em>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="right-pane">
        <Badges updateNewsFeed={updateNewsFeed} /> {/* Pass updateNewsFeed function to Badges */}
      </div>
    </div>
  );
}

export default Home;
