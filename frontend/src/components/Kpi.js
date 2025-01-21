import React, { useState } from 'react';
import axios from 'axios';
import './Profile.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Kpi() {
  const [entries, setEntries] = useState([{ title: '', field1: '', field2: '', field3: '' }]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const addRow = () => {
    setEntries([...entries, { title: '', field1: '', field2: '', field3: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Promise.all(
        entries.map(entry => 
          axios.post(`${apiUrl}/kpi`, entry)
        )
      );
      setMessage('Data submitted successfully!');
      setEntries([{ title: '', field1: '', field2: '', field3: '' }]);
    } catch (error) {
      console.error('Error submitting KPI data:', error);
      setMessage('Failed to submit data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kpi-container">
      <h2>KPI Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Field 1</th>
                <th>Field 2</th>
                <th>Field 3</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={entry.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      placeholder="Title"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={entry.field1}
                      onChange={(e) => handleChange(index, 'field1', e.target.value)}
                      placeholder="Field 1"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={entry.field2}
                      onChange={(e) => handleChange(index, 'field2', e.target.value)}
                      placeholder="Field 2"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={entry.field3}
                      onChange={(e) => handleChange(index, 'field3', e.target.value)}
                      placeholder="Field 3"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="button-container">
          <button 
            type="button" 
            onClick={addRow}
            className="add-button"
          >
            Add Row
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? 'Submitting...' : 'Submit All'}
          </button>
        </div>
      </form>
      
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Kpi;