import React, { useState } from 'react';
import axios from 'axios';

const RecognizeForm = () => {
  const [fromUsername, setFromUsername] = useState('');
  const [toUsername, setToUsername] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/recognitions', { fromUsername, toUsername, reason });
      setFromUsername('');
      setToUsername('');
      setReason('');
      window.dispatchEvent(new CustomEvent('newRecognition'));
    } catch (error) {
      console.error('Error sending recognition:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fromUsername">From:</label>
        <input
          type="text"
          id="fromUsername"
          value={fromUsername}
          onChange={(e) => setFromUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="toUsername">To:</label>
        <input
          type="text"
          id="toUsername"
          value={toUsername}
          onChange={(e) => setToUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="reason">Reason:</label>
        <input
          type="text"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <button type="submit">Recognize</button>
    </form>
  );
};

export default RecognizeForm;
