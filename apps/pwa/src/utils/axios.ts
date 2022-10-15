import axios from 'axios';
// config
import { TMRA_RAISE_URL } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: TMRA_RAISE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
