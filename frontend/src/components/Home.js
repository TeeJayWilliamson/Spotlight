import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function Home() {
  const [name, setName] = useState('');
  const [newsFeed, setNewsFeed] = useState([]); // Moved newsFeed to state

  // Set the API URL to use Heroku in production
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  const fetchNewsFeed = () => {
    axios.get(`${apiUrl}recognitions`)
      .then(response => {
        setNewsFeed(response.data);
      })
      .catch(error => {
        console.error('Error fetching news feed:', error);
      });
  };

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

    fetchNewsFeed(); // Fetch the news feed initially

    const handleNewRecognition = () => {
      fetchNewsFeed(); // Refetch the news feed when a new recognition is sent
    };

    window.addEventListener('newRecognition', handleNewRecognition);

    return () => {
      window.removeEventListener('newRecognition', handleNewRecognition);
    };
  }, []); // Add fetchNewsFeed as a dependency

  return (
    <div className="home-container">
      <div className="left-pane">
        <div className="user-info">
          <div className="user-name">{name}</div>
        </div>
        <div className="divider" />
        <div className="point-balance">
          <h2>Point Balance</h2>
          <p>1000</p>
        </div>
        <div className="divider" />
        <div className="recognize-now">
          <h2>Recognize Now</h2>
          <p>5000</p>
        </div>
        <div className="divider" />
        <button className="request-budget-button">Request more budget</button>
      </div>
      <div className="newsfeed-section">
        <h2>Newsfeed</h2>
        <ul>
          {newsFeed.map((item, index) => (
            <li key={index}>
              <span className="newsfeed-time">{item.time}</span>
              <span className="newsfeed-user">{item.name}</span> {item.action} <span className="newsfeed-recipient">{item.recipient}</span> for <span className="newsfeed-reason">{item.reason}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="right-pane">
        <div className="top-recognized">
          <h2>Top Recognized</h2>
          <ul>
            <li>1. John Doe</li>
            <li>2. Jane Smith</li>
            <li>3. Michael Johnson</li>
            <li>4. Emily Brown</li>
            <li>5. David Wilson</li>
            <li>6. Jessica Miller</li>
            <li>7. Daniel Anderson</li>
            <li>8. Megan Taylor</li>
            <li>9. Christopher Thomas</li>
            <li>10. Amanda Jackson</li>
          </ul>
        </div>
        <div className="your-ranking">
          <h2>Your Ranking</h2>
          <p>25</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
