import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL ? process.env.API_BASE_URL : '',
  timeout: 60000,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json; charset=utf-8'
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials':'true',
    Pragma: 'no-cache',
    Expires: 0,
  },
});
export default api;
