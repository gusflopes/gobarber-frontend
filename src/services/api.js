import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_ENV === 'remote'
      ? process.env.REACT_APP_API_REMOTE
      : process.env.REACT_APP_API_LOCAL,
});

export default api;
