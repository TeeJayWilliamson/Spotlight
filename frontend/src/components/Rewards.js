import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Rewards() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/rewards') // Adjust URL if needed
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
