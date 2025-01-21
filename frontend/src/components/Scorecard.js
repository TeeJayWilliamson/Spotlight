import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

function Scorecard() {
  const [scorecard, setScorecard] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scorecardUrl = new URL('scorecard', apiUrl);
    axios
      .get(scorecardUrl.toString())
      .then((response) => {
        if (Array.isArray(response.data)) {
          setScorecard(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setScorecard([]);
          setError("Received invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching scorecard:", error);
        setError("Failed to fetch scorecard data");
      });
  }, [apiUrl]);

  return (
    <div className="rewards-container">
      <h2>Scorecard</h2>  
      <div className="divider"></div> 
    </div>
    
    
  );
}

export default Scorecard;
