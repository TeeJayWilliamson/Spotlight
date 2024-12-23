import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function Home() {
  const [name, setName] = useState('');

    // Set the API URL to use Heroku in production
    const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';
  
  const newsFeed = [
    {
      name: 'Trevor Williamson',
      action: 'sent a Spotlight recognition to',
      recipient: 'Joseph Sturino',
      reason: 'for outstanding teamwork during the project.',
      time: '2 hours ago',
    },
    {
      name: 'Gurinder Bhatti',
      action: 'awarded a emblem to',
      recipient: 'Sarva Gopalapillai',
      reason: 'for exceptional problem-solving skills.',
      time: '3 hours ago',
    },
    {
      name: 'Talwinder Hayear',
      action: 'gave a Spotlight to',
      recipient: 'Benny Singh',
      reason: 'for being a great team player.',
      time: '5 hours ago',
    },
    {
      name: 'Michael Del Sole',
      action: 'sent a Spotlight recognition to',
      recipient: 'Paul Cho',
      reason: 'for his support on the latest project.',
      time: '6 hours ago',
    },
    {
      name: 'Ryan Watson',
      action: 'awarded a emblem to',
      recipient: 'Raminder Rai',
      reason: 'for demonstrating excellent leadership skills.',
      time: '8 hours ago',
    },
    {
      name: 'Joseph Hurtubise',
      action: 'gave a Spotlight to',
      recipient: 'Trevor Williamson',
      reason: 'for consistently going above and beyond in his work.',
      time: '1 day ago',
    },
    {
      name: 'Sarva Gopalapillai',
      action: 'sent a Spotlight recognition to',
      recipient: 'Gurinder Bhatti',
      reason: 'for exceptional attention to detail in reports.',
      time: '1 day ago',
    },
    {
      name: 'Benny Singh',
      action: 'awarded a emblem to',
      recipient: 'Michael Del Sole',
      reason: 'for keeping the team on track.',
      time: '2 days ago',
    },
    {
      name: 'Paul Cho',
      action: 'sent a Spotlight to',
      recipient: 'Talwinder Hayear',
      reason: 'for his creativity and out-of-the-box thinking.',
      time: '2 days ago',
    },
    {
      name: 'Ryan Watson',
      action: 'awarded a emblem to',
      recipient: 'Joseph Hurtubise',
      reason: 'for handling a difficult situation with professionalism.',
      time: '3 days ago',
    },
  ];

  useEffect(() => {
    const username = localStorage.getItem('username'); // Retrieve username from localStorage
  
    if (username) {
      // Make an API call to fetch user info from the backend
      axios
        .get(`${apiUrl}user/${username}`) // Use the apiUrl for the API route
        .then((response) => {
          setName(response.data.name); // Set the full name in the state
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  }, []);

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
        <div className="divider"></div>
{/*}
        <div className="divider"></div>
        <button className="request-budget-btn">Request More Budget</button>
      </div>
*/}
      <div className="center-pane">
        <div className="newsfeed">
          <h2>Newsfeed</h2>
          {newsFeed.map((item, index) => (
            <div
              key={index}
              className="news-item"
              style={{
                backgroundColor: 'white',
                padding: '10px',
                marginBottom: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p>
                <strong>{item.name}</strong> {item.action} <strong>{item.recipient}</strong><br></br> {item.reason}{' '}
                <em>({item.time})</em>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="right-pane">
        <div className="top-recognized">
          <h4>Top Recognized</h4>
          <div className="separator"></div>
          <div className="this-month">
            <p>This Month</p>
          </div>
          <div className="separator"></div>
          <div className="rank-info">
            <div className="rank">
              <p className="rank-number">06th</p>
              <p className="rank-label">Place</p>
            </div>
            <div className="recognition-stats">
              <p>03 emblems given</p>
              <p>In the spotlight since</p>
              <p>Dec 02, 2024</p>
            </div>
          </div>
          <div className="separator"></div>
          <div className="bottom-section">
            <h5>Top 10 Recognizers</h5>
            <ul>
              <li>Michael Del Sole - 10 emblems</li>
              <li>Paul Cho - 8 emblems</li>
              <li>Sarva Gopalapillai - 7 emblems</li>
              <li>Gurinder Bhatti - 5 emblems</li>
              <li>Joseph Sturino - 4 emblems</li>
              <li>Trevor Williamson - 3 emblems</li>
              <li>Benny Singh - 2 emblems</li>
              <li>Ryan Watson - 1 emblem</li>
              <li>Talwinder Hayear - 1 emblem</li>
              <li>Raminder Rai - 1 emblem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
