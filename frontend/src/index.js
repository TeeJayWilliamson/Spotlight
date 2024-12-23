import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Your main App component
import './index.css';  // Import your global CSS
import { NewsFeedProvider } from './NewsFeedContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

ReactDOM.render(
  <NewsFeedProvider>
    <App />
  </NewsFeedProvider>,
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
