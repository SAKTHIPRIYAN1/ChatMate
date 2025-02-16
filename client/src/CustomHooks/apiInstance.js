import axios from 'axios';
import { useSelector } from 'react-redux';

const VITE_BACKURL = import.meta.env.VITE_BACKURL;
import store from '../Store/store';

const api = axios.create({
  baseURL: '/api',
});

const accessToken=store.getState().User.accessToken;
// Axios interceptor for refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true;

      try {
        // Get a new access token
        const { data } = await axios.post(VITE_BACKURL+'/refresh-token', {accessToken}, { withCredentials: true });

        // Update token in headers
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
        
        
        // Retry the failed request
        return api(error.config);
      } catch (err) {
        console.error("Refresh token failed:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
