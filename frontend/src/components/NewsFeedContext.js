// NewsFeedContext.js
import React, { createContext, useState } from 'react';

export const NewsFeedContext = createContext();

export const NewsFeedProvider = ({ children }) => {
  const [newsFeed, setNewsFeed] = useState([
    // Initial newsfeed items
  ]);

  const addNewsItem = (item) => {
    setNewsFeed([item, ...newsFeed]);
  };

  return (
    <NewsFeedContext.Provider value={{ newsFeed, addNewsItem }}>
      {children}
    </NewsFeedContext.Provider>
  );
};
