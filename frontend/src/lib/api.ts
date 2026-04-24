import axios from 'axios';

const fallbackApiBaseUrl = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? fallbackApiBaseUrl,
  withCredentials: true,  // send cookies automatically
});

export default api;