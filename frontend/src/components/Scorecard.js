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
          console.error('Unexpected data format:', response.data);
          setScorecard([]);
          setError('Received invalid data format');
        }
      })
      .catch((error) => {
        console.error('Error fetching scorecard data:', error);
        setError('Failed to fetch scorecard data');
      });
  }, []);

  return (
    <div className="scorecard-container">
      <h2>Scorecard</h2>
      <div className="divider"></div>

      {error ? (
        <p className="error-message">{error}</p>
      ) : scorecard.length > 0 ? (
        <div className="scorecard-content">
          {scorecard.map((item, index) => (
            <div key={index} className="scorecard-item">
              <h3>{item.title || `Entry ${index + 1}`}</h3>
              <p><strong>Field 1:</strong> {item.field1}</p>
              <p><strong>Field 2:</strong> {item.field2}</p>
              <p><strong>Field 3:</strong> {item.field3}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default Scorecard;
