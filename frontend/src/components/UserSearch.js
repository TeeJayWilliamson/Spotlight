import React, { useState, useEffect } from 'react';

const UserSearch = ({ users, onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(lowerCaseQuery) ||
        user.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  const handleUserClick = (user) => {
    onUserSelect(user);
    setSearchQuery(''); // Clear search after selection
  };

  return (
    <div className="recognition-section" style={{ backgroundColor: '#621E8B', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
      <div className="input-container" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Who would you like to recognize?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          className="bx bx-search-alt" 
          onClick={() => filteredUsers.length > 0 && handleUserClick(filteredUsers[0])}
          style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
        />
      </div>
      {filteredUsers.length > 0 && (
        <div className="user-suggestions" style={{ 
          backgroundColor: '#fff',
          borderRadius: '5px',
          marginTop: '5px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {filteredUsers.map(user => (
              <li
                key={user.username}
                onClick={() => handleUserClick(user)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  transition: 'background-color 0.2s'
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
  );
};

export default UserSearch;