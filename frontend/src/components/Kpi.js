import React, { useState } from 'react';
import axios from 'axios';
import './Profile.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Kpi() {
  const [formData, setFormData] = useState({
    title: '',
    field1: '',
    field2: '',
    field3: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/kpi`, formData)
      .then((response) => {
        setMessage('Data submitted successfully!');
        setFormData({ title: '', field1: '', field2: '', field3: '' }); // Reset form
      })
      .catch((error) => {
        console.error('Error submitting KPI data:', error);
        setMessage('Failed to submit data');
      });
  };

  return (
    <div className="kpi-container">
      <h2>KPI Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Field 1:</label>
          <input
            type="text"
            name="field1"
            value={formData.field1}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Field 2:</label>
          <input
            type="text"
            name="field2"
            value={formData.field2}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Field 3:</label>
          <input
            type="text"
            name="field3"
            value={formData.field3}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Kpi;
