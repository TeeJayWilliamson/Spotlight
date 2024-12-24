// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function Home() {
  const [name, setName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com/';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');
        if (username) {
          const userResponse = await axios.get(`${apiUrl}user/${username}`);
          setName(userResponse.data.name);
        }

        // Fetch posts from the backend
        const postsResponse = await axios.get(`${apiUrl}posts`);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Fetch new posts every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  // Format the timestamp to "X time ago"
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="home-container">
      <div className="left-pane">
        <div className="user-info">
          <h3>{name.split(' ')[0]}'s Account</h3>
        </div>
        <div className="divider"></div>
        <div className="balance-info">
          <p className="label">Point Balance:</p>
          <p className="large-number">1000</p>
        </div>
        <div className="divider"></div>
      </div>

      <div className="center-pane">
        <div className="newsfeed">
          <h2>Newsfeed</h2>
          {loading ? (
            <div>Loading...</div>
          ) : posts.length === 0 ? (
            <div>No recognitions yet</div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="news-item"
                style={{
                  backgroundColor: 'white',
                  padding: '10px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* Emblem Image */}
                <div style={{ marginRight: '15px', minWidth: '50px' }}>
                  <img 
                    src={post.emblem.image} 
                    alt={post.emblem.title}
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>

                {/* Content */}
                <div>
                  <p>
                    <strong>{post.name}</strong> is Spotlighting{' '}
                    <strong>{post.recipients.join(' and ')}</strong>
                    <br />
                    for {post.emblem.title}. {post.message}{' '}
                    <em>({formatTimeAgo(post.timestamp)})</em>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="right-pane">
        <div className="top-recognized">
          <h4>Top Recognized</h4>
          <div className="separator"></div>
          <div className="this-month">
            <p>This Month</p>
          </div>
          <div className="separator"></div>
          <div className="rank-info">
            <div className="rank">
              <p className="rank-number">06th</p>
              <p className="rank-label">Place</p>
            </div>
            <div className="recognition-stats">
              <p>03 emblems given</p>
              <p>In the spotlight since</p>
              <p>Dec 02, 2024</p>
            </div>
          </div>
          <div className="separator"></div>
          <div className="bottom-section">
            <h5>Top 10 Recognizers</h5>
            <ul>
              <li>Michael Del Sole - 10 emblems</li>
              <li>Paul Cho - 8 emblems</li>
              <li>Sarva Gopalapillai - 7 emblems</li>
              <li>Gurinder Bhatti - 5 emblems</li>
              <li>Joseph Sturino - 4 emblems</li>
              <li>Trevor Williamson - 3 emblems</li>
              <li>Benny Singh - 2 emblems</li>
              <li>Ryan Watson - 1 emblem</li>
              <li>Talwinder Hayear - 1 emblem</li>
              <li>Raminder Rai - 1 emblem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;