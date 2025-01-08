import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';


function Scorecard() {
  const [scorecard, setScorecard] = useState([]);

  useEffect(() => {
    const scorecardUrl = new URL('scorecard', apiUrl);
    axios
      .get(scorecardUrl.toString())
      .then((response) => {
        setScorecard(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scorecard:", error);
      });
  }, [apiUrl]);
  

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
