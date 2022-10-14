import axios from 'axios';
// config
import { UPLOAD_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: UPLOAD_API,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
