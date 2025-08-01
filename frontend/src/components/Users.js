import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Profile.css';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-d907a9a2d80e.herokuapp.com';
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    const usersUrl = new URL('users', apiUrl);
    axios
      .get(usersUrl.toString())
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [apiUrl, location.search]);

  useEffect(() => {
    if (searchQuery) {
      const foundUser = users.find(user =>
        user.username.toLowerCase() === searchQuery.toLowerCase() ||
        user.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (foundUser) {
        setSelectedUser(foundUser);
        setSearchQuery('');
      }
    }
  }, [searchQuery, users]);

  // Filter users based on the search query
  const filteredUsers = users.filter((user) => {
    const username = user.username ? user.username.toLowerCase() : '';
    const name = user.name ? user.name.toLowerCase() : '';
    return (
      username.includes(searchQuery.toLowerCase()) ||
      name.includes(searchQuery.toLowerCase())
    );
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSearchQuery('');
  };

  return (
    <div className="profile-container">
      <h2>Users List</h2>
      <div className="divider"></div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery && (
          <div className="user-suggestions">
            <ul>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li key={user.username} onClick={() => handleUserClick(user)}>
                    <span>{user.username}</span> - <span>{user.name}</span>
                  </li>
                ))
              ) : (
                <li>No users found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="profile-header">
          <h3>{selectedUser.name}'s Profile</h3>
          <div className="divider"></div>
          <div className="profile-layout">
            <div className="profile-details">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Employee Number:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <br />
              <p><strong>Point Balance:</strong> {selectedUser.currentPointBalance}</p>
              <p><strong>Spotlight Now Balance:</strong> {selectedUser.recognizeNowBalance}</p>
              <p><strong>Emblems Given:</strong> {selectedUser.badgesGiven}</p>
              <p><strong>Rewards Redeemed:</strong> {selectedUser.rewardsRedeemed}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
              <p><strong>Accomplishments:</strong> {selectedUser.accomplishments || "No accomplishments yet"}</p>

              <div className="badges">
                <h4>Emblems Earned:</h4>
                <ul>
                  {(selectedUser.badges || []).map((badge, index) => (
                    <li key={index}>{badge}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="profile-image-section">
              <div
                className="profile-image-container"
                style={{
                  backgroundImage: `url(${imageLoaded ? selectedUser.profileImage : '/img/defaultprofilepic.png'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Image will be set as background, no need for alt text */}
                <img
                  src={selectedUser.profileImage || '/img/defaultprofilepic.png'}
                  alt={`${selectedUser.name}'s avatar`}
                  className="profile-avatar"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/defaultprofilepic.png';
                  }}
                  style={{ display: 'none' }} // Hide the image tag itself
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
