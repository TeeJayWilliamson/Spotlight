import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function Home() {
  const [name, setName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');
        if (username) {
          const userUrl = new URL(`user/${username}`, apiUrl);
          const userResponse = await axios.get(userUrl.toString());
          console.log('User response:', userResponse.data);
          setName(userResponse.data.name);
        }

        const postsUrl = new URL('posts', apiUrl);
        const postsResponse = await axios.get(postsUrl.toString());
        console.log('Posts response:', postsResponse.data);
        setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        console.error('Full error:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, liked: !post.liked } : post
    ));
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
          ) : !Array.isArray(posts) || posts.length === 0 ? (
            <div>No recognitions yet</div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="news-item">
                <div className="news-item-header">
                  <img 
                    src={post.emblem.image} 
                    alt={post.emblem.title}
                    className="emblem-image"
                  />
                  <div className="emblem-info">
                    <p className="emblem-name">{post.emblem.title}</p>
                    <p className="recipients">{post.recipients.join(', ')}</p>
                  </div>
                </div>
                <div className="separator"></div>
                <div className="news-item-message">
                  <p>{post.message}</p>
                </div>
                <div className="news-item-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p className="sender-name">{post.name}</p>
                    <p className="timestamp" style={{ marginLeft: '5px' }}><em>({formatTimeAgo(post.timestamp)})</em></p>
                  </div>
                  <div className="action-links" style={{ display: 'flex', gap: '10px' }}>
                    <a href="#" onClick={() => handleLike(post._id)} style={{ textDecoration: 'none', color: '#621E8B' }}>
                      {post.liked ? (
                        <i className='bx bxs-like'></i> // Filled thumbs up
                      ) : (
                        <i className='bx bx-like'></i> // Empty thumbs up
                      )}
                    </a>
                    <a href="#" style={{ textDecoration: 'none', color: '#621E8B' }}>Comment</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#621E8B' }}>Share</a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="right-pane">
        <div className="top-recognized">
          <div className="top-bar">
            <h4>Top Recognized</h4>
          </div>
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
