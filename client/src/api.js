// src/api.js
import axios from 'axios';

const api = axios.create({
  // This uses your Vercel environment variable in production,
  // and defaults to your local server in development.
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
});

export default api;