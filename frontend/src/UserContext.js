import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pointBalance, setPointBalance] = useState(0);
  const [recognizeNowBalance, setRecognizeNowBalance] = useState(0);
  const [isManagement, setIsManagement] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://spotlight-ttc-30e93233aa0e.herokuapp.com';

  useEffect(() => {
    const fetchUserPoints = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      console.log('Attempting to fetch user data with:', { token, username });

      if (token && username) {
        try {
          const response = await axios.get(`${apiUrl}/user/${username}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.group('User Data Fetch');
          console.log('Full API Response:', response.data);
          console.log('Is Management:', response.data.isManagement);
          console.log('Recognize Now Balance:', response.data.recognizeNowBalance);
          console.log('Current Point Balance:', response.data.currentPointBalance);
          console.groupEnd();

          setPointBalance(response.data.currentPointBalance || 0);
          setRecognizeNowBalance(response.data.recognizeNowBalance || 0);
          setIsManagement(response.data.isManagement || false);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user points', error.response?.data || error.message);
          
          // Optional: Clear token if fetch fails
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setUser(null);
          }
        }
      }
    };

    // Remove the !user condition to always try fetching on mount
    fetchUserPoints();
  }, []); // Empty dependency array to run only on mount

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      pointBalance, 
      setPointBalance,
      recognizeNowBalance,
      setRecognizeNowBalance,
      isManagement,
      setIsManagement,
      apiUrl  // Optional: include apiUrl in context if needed elsewhere
    }}>
      {children}
    </UserContext.Provider>
  );
};
