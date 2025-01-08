import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Rewards() {
  const [rewards, setRewards] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

  useEffect(() => {
    const rewardsUrl = new URL('rewards', apiUrl);
    axios
      .get(rewardsUrl.toString())
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRewards(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching rewards:", error);
      });
  }, [apiUrl]);

  return (
    <div className="rewards-container">
      <h2>Rewards List</h2>
      <div className="divider"></div>
      <ul>
        {Array.isArray(rewards) && rewards.length > 0 ? (
          rewards.map((reward) => (
            <li key={reward.id}>
              <span>{reward.name}</span>
              {/* Additional reward info could be added here */}
            </li>
          ))
        ) : (
          <li></li> // Fallback message when no rewards are available
        )}
      </ul>
    </div>
  );
}

export default Rewards;
