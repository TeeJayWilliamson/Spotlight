import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../App.css';
import './Home.css'; // Assuming you will create this CSS file for additional styles

function Home() {
  const [name, setName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // State to hold users for recognition
  const [searchQuery, setSearchQuery] = useState(''); // Search query for user recognition
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users based on search query
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';
  const navigate = useNavigate(); // Initialize useNavigate

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

        // Fetch users for recognition
        const usersUrl = new URL('users', apiUrl);
        const usersResponse = await axios.get(usersUrl.toString());
        console.log('Users data loaded:', usersResponse.data);
        setUsers(usersResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user =>
        (user.username?.toLowerCase().includes(lowerCaseQuery) || false) ||
        (user.name?.toLowerCase().includes(lowerCaseQuery) || false)
      );
      console.log('Filtered users:', filtered); // Debugging line
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  const handleUserClick = (user) => {
    navigate(`/badges`, { 
      state: { selectedUser: user } 
    });
    setSearchQuery('');
    setFilteredUsers([]);
  };

  const handleSearchSubmit = () => {
    if (filteredUsers.length > 0) {
      handleUserClick(filteredUsers[0]); // Automatically select the first user in the suggestions
    }
  };

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
        <div className="recognition-section" style={{ backgroundColor: '#621E8B', padding: '15px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
          <div className="input-container" style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Who would you like to recognize?"
              value={searchQuery}
              onChange={(e) => {
                console.log('Search input changed:', e.target.value);
                setSearchQuery(e.target.value);
              }}
              style={{
                flex: '1',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                outline: 'none',
                marginRight: '10px'
              }}
            />
            <i 
              className='bx bx-search-alt' 
              onClick={handleSearchSubmit} 
              style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
            />
          </div>

          {filteredUsers.length > 0 && searchQuery && (
            <div className="user-suggestions" style={{ 
              backgroundColor: '#fff', 
              borderRadius: '5px', 
              marginTop: '5px',
              maxHeight: '150px', 
              overflowY: 'auto',
              position: 'absolute',
              top: '100%',
              left: '15px',
              right: '15px',
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                {filteredUsers.map(user => (
                  <li 
                    key={user.username} 
                    onClick={() => handleUserClick(user)}
                    style={{ 
                      padding: '10px', 
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {user.name} - {user.username}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Newsfeed Section */}
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
                    style={{ width: '50px', height: '50px' }} // Adjusted size for emblem
                  />
                  <div className="emblem-info">
                    <p className="emblem-name">{post.emblem.title}</p>
                    <p className="recipients">{post.recipients.join(', ')}</p>
                  </div>
                </div>
                <div className="news-item-message" style={{ marginBottom: '20px', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                  <p>{post.message}</p>
                </div>
                <div className="news-item-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Link to Users.js page with search query */}
                    <a 
                      href="#" // Prevent default anchor behavior
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor click behavior
                        navigate(`/users?search=${encodeURIComponent(post.name)}`); // Navigate to users page with search query
                      }} 
                      className="sender-name" 
                      style={{ textDecoration: 'none', color: '#621E8B' }}
                    >
                      {post.name}
                    </a>
                    <p className="timestamp" style={{ marginLeft: '5px', fontSize: '14px' }}><em>({formatTimeAgo(post.timestamp)})</em></p>
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