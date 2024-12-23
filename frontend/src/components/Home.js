// Home.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { NewsFeedContext } from './NewsFeedContext';

function Home() {
  const { newsFeed } = useContext(NewsFeedContext);
  const [name, setName] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

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

        {/*<div className="divider"></div>
        <button className="request-budget-btn">Request More Budget</button>*/}
      </div>

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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
