import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';  // Use the same CSS file for consistent styling

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Filter users based on the search query
  const filteredUsers = users.filter((user) => {
    const username = user.username ? user.username.toLowerCase() : '';
    const name = user.name ? user.name.toLowerCase() : '';
    return (
      username.includes(searchQuery.toLowerCase()) ||
      name.includes(searchQuery.toLowerCase())
    );
  });

  // Handle user selection from the suggestions list
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSearchQuery('');  // Clear the search input when a user is selected
  };

  return (
    <div className="profile-container">  {/* Use Profile container class for consistency */}
      <h2>Users List</h2>
      <div className="divider"></div>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query as user types
        />
        
        {/* Conditionally render the suggestion list when there's a search query */}
        {searchQuery && (
          <div className="user-suggestions">
            <ul>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li key={user.username} onClick={() => handleUserClick(user)}>
                    <span>{user.username}</span> - <span>{user.name}</span> {/* Show username and name */}
                  </li>
                ))
              ) : (
                <li>No users found</li> // Display a message if no users match the search query
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed user profile */}
      {selectedUser && (
        <div className="profile-header">
          <h3>{selectedUser.name}'s Profile</h3>
          <div className="divider"></div>
          <div className="profile-details">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Employee Number:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <br />
            <p><strong>Point Balance:</strong> {selectedUser.currentPointBalance}</p>
            <p><strong>Spotlight Now Balance:</strong> {selectedUser.recognizeNowBalance}</p>
            <p><strong>Badges Given:</strong> {selectedUser.badgesGiven}</p>
            <p><strong>Rewards Redeemed:</strong> {selectedUser.rewardsRedeemed}</p>
            <p><strong>Joined:</strong> {new Date(selectedUser.joinedDate).toLocaleDateString()}</p>

            <p><strong>Accomplishments:</strong> {selectedUser.accomplishments || "No accomplishments yet"}</p>

            <div className="badges">
              <h4>Badges Earned:</h4>
              <ul>
                {(selectedUser.badges || []).map((badge, index) => (
                  <li key={index}>{badge}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
