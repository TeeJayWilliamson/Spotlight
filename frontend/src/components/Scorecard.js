import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Scorecard() {
  const [scorecard, setScorecard] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/scorecard') // Adjust URL if needed
      .then((response) => {
        setScorecard(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scorecard:", error);
      });
  }, []);

  return (
    <div className="rewards-container">
      <h2>Scorecard</h2>
      <div className="divider"></div>
      <ul>
        {scorecard.map((scorecard) => (
          <li key={scorecard.id}>
            <span>{scorecard.name}</span>
            {/* Additional scorecard info could be added here */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Scorecard;
