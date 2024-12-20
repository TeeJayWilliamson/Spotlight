import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Rewards() {
  const [rewards, setRewards] = useState([]);
  
  // Set the API URL to use Heroku in production
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    axios
      .get(`${apiUrl}rewards`) // Use apiUrl here
      .then((response) => {
        setRewards(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rewards:", error);
      });
  }, []);

  return (
    <div className="rewards-container">
      <h2>Rewards List</h2>
      <div className="divider"></div>
      <ul>
        {rewards.map((reward) => (
          <li key={reward.id}>
            <span>{reward.name}</span>
            {/* Additional reward info could be added here */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rewards;
