import React, { useState } from 'react';
import axios from 'axios';

function SendEmblemModal({ fromUsername, users, closeModal }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [emblemReason, setEmblemReason] = useState('');

  const handleSendEmblem = () => {
    if (selectedUser && emblemReason) {
      axios.post('http://localhost:5000/send-emblem', {
        fromUsername,
        toUsername: selectedUser,
        reason: emblemReason
      })
      .then((response) => {
        alert('Emblem sent!');
        closeModal(); // Close modal after submitting
      })
      .catch((error) => {
        console.error("Error sending emblem:", error);
      });
    }
  };

  return (
    <div className="modal">
      <h3>Send Emblem</h3>
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        <option>Select a user</option>
        {users.map((user) => (
          <option key={user.username} value={user.username}>{user.username}</option>
        ))}
      </select>
      <input 
        type="text" 
        placeholder="Reason for the emblem" 
        value={emblemReason} 
        onChange={(e) => setEmblemReason(e.target.value)} 
      />
      <button onClick={handleSendEmblem}>Send Emblem</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
}

export default SendEmblemModal;
