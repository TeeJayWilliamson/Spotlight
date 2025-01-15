import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import './Profile.css';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [avatarURL, setAvatarURL] = useState('path/to/default-image.png');
  const [imageFile, setImageFile] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (username) {
      const userUrl = new URL(`user/${username}`, apiUrl);
      axios
        .get(userUrl.toString())
        .then((response) => {
          setUserInfo(response.data);
          if (response.data.profileImage) {
            setAvatarURL(response.data.profileImage);
          }
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  }, [apiUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarURL(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
  
      try {
        // Upload image to Cloudinary
        const uploadResponse = await axios.post(`${apiUrl}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
  
        const imageUrl = uploadResponse.data.url;
  
        // Update user profile with new image URL
        const username = localStorage.getItem('username');
        await axios.post(`${apiUrl}/updateProfileImage`, {
          username,
          profileImage: imageUrl
        });
  
        alert('Profile image updated successfully!');
        setAvatarURL(imageUrl);
  
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      }
    }
  };

  if (!userInfo) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h2>{userInfo.name}'s Profile</h2>
          <h3>Badge {userInfo.username}</h3>
          <div className="divider"></div>
        </div>

        <div className="profile-layout">
          <div className="profile-details">
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Employee Number:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <br />
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

          <div className="profile-image-section">
            <div className="profile-image-container">
              <img src={avatarURL} alt="Profile" className="profile-avatar" />
              <div className="profile-image-controls">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="profile-image-input"
                />
                <button 
                  onClick={handleSubmit} 
                  className="profile-upload-btn"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;