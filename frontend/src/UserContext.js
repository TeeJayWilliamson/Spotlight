import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract balances and isManagement from user object for convenience
  const pointBalance = user?.currentPointBalance || 0;
  const recognizeNowBalance = user?.recognizeNowBalance || 0;
  const isManagement = user?.isManagement || false;

  const API_URL =
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL || 'https://spotlight-d907a9a2d80e.herokuapp.com'
      : 'http://localhost:5000';

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        verifyToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axios.get(`${API_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${tokenToVerify}` },
      });

      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Optionally add a function to refresh user data from server
  const refreshUserData = async () => {
    if (!token || !user?.username) return;
    try {
      const response = await axios.get(`${API_URL}/user/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      if (error.response?.status === 401) logout();
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        logout,
        pointBalance,
        recognizeNowBalance,
        isManagement,
        refreshUserData,
        API_URL,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };

