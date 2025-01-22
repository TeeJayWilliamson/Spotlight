import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopRecognizers() {
  const [topRecognizers, setTopRecognizers] = useState([]);

  useEffect(() => {
    const fetchTopRecognizers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/top-recognizers'); // Use your actual backend port
        setTopRecognizers(response.data);
      } catch (error) {
        console.error('Error fetching top recognizers:', error);
      }
    };

    fetchTopRecognizers();
  }, []);

  return (
    <div className="bottom-section">
      <h5>Top 10 Recognizers</h5>
      <ul>
        {topRecognizers.length > 0 ? (
          topRecognizers.map((recognizer, index) => (
            <li key={index}>
              {recognizer.name} - {recognizer.emblemsSent} emblem{recognizer.emblemsSent > 1 ? 's' : ''}
            </li>
          ))
        ) : (
          <li>Loading top recognizers...</li>
        )}
      </ul>
    </div>
  );
}

export default TopRecognizers;
