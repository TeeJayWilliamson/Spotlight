import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Scorecard() {
  const [scorecard, setScorecard] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('api'); // 'api' or 'google'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/scorecard`);
        if (Array.isArray(response.data)) {
          setScorecard(response.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching scorecard data:', error);
        setError('Failed to fetch scorecard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${apiUrl}/scorecard`);
      console.log('Response:', response.data);
      setScorecard([]);
      setError(null);
    } catch (error) {
      console.error('Error clearing data:', error);
      setError(error.response?.data?.message || 'Failed to clear scorecard data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setViewMode(viewMode === 'api' ? 'google' : 'api');
  };

  if (isLoading) {
    return (
      <div className="scorecard-container">
        <h2>Scorecard</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scorecard-container">
        <h2>Scorecard</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="scorecard-container">
      <h2>Scorecard</h2>
      
      <button className="toggle-button" onClick={toggleView}>
        Switch to {viewMode === 'api' ? 'Google Sheet View' : 'Backend Table View'}
      </button>

      {viewMode === 'google' ? (
        <div className="iframe-container">
          <iframe
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSqZHcVHS58TanV6y57lOG_f4gUDDT690jNtbwsTvZxFILPpbePjPHsWIzedIVJ-cT3DBRKbnhFyjXy/pubhtml?widget=true&amp;headers=false"
            width="100%"
            height="600"
            frameBorder="0"
            title="Scorecard Sheet"
          ></iframe>
        </div>
      ) : (
        <>
          {scorecard.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Field 1</th>
                    <th>Field 2</th>
                    <th>Field 3</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scorecard.map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.field1}</td>
                      <td>{item.field2}</td>
                      <td>{item.field3}</td>
                      <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">No data available</div>
          )}
        </>
      )}
    </div>
  );
}

export default Scorecard;
