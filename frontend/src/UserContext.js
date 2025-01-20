// Create a new UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pointBalance, setPointBalance] = useState(0);

  useEffect(() => {
    const fetchUserPoints = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      
      if (token && username) {
        try {
          const response = await axios.get(`/user/${username}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPointBalance(response.data.currentPointBalance);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user points', error);
        }
      }
    };

    fetchUserPoints();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      pointBalance, 
      setPointBalance 
    }}>
      {children}
    </UserContext.Provider>
  );
};
