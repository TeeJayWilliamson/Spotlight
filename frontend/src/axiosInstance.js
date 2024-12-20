import axios from 'axios';

// Axios instance with a dynamic base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Fallback to localhost if the environment variable is not set
});

export default api;
