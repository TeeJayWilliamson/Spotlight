import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import './Profile.css';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);

  // Set the API URL to use Heroku in production
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

useEffect(() => {
  const username = localStorage.getItem('username');

  if (username) {
    const userUrl = new URL(`user/${username}`, apiUrl);
    axios
      .get(userUrl.toString())
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  }
}, [apiUrl]);


  if (!userInfo) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{userInfo.name}'s Profile</h2> {/* Full name */}
        <h3>Badge {userInfo.username}</h3>
        <div className="divider"></div>
      </div>

      <div className="profile-details">
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Employee Number:</strong> {userInfo.username}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <br></br>
        <p><strong>Point Balance:</strong> {userInfo.currentPointBalance}</p>
        <p><strong>Spotlight Now Balance:</strong> {userInfo.recognizeNowBalance}</p>
        <p><strong>Badges Given:</strong> {userInfo.badgesGiven}</p>
        <p><strong>Rewards Redeemed:</strong> {userInfo.rewardsRedeemed}</p>
        <p><strong>Joined:</strong> {new Date(userInfo.joinedDate).toLocaleDateString()}</p>

        <p><strong>Accomplishments:</strong> {userInfo.accomplishments || "No accomplishments yet"}</p>

        <div className="badges">
          <h4>Badges Earned:</h4>
          <ul>
            {(userInfo.badges || []).map((badge, index) => (
              <li key={index}>{badge}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;
