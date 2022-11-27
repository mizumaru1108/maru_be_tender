import axios from 'axios';
// config
import { TMRA_RAISE_URL } from '../config';

import jwtDecode from 'jwt-decode';
import { fusionAuthClient } from './fusionAuth';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: TMRA_RAISE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

axiosInstance.interceptors.request.use(
  async (config) => {
    const controller = new AbortController();

    const acccessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const decoded = jwtDecode<{ exp: number }>(acccessToken!);

    const currentTime = Date.now() / 1000;
    if (!(decoded.exp > currentTime)) {
      const result = await fusionAuthClient.exchangeRefreshTokenForJWT({
        refreshToken: refreshToken ?? '',
      });
      if (result.response?.refreshToken && result.response?.token) {
        localStorage.setItem('accessToken', result.response.token);
        localStorage.setItem('refreshToken', result.response.refreshToken);
        config.headers = {
          Authorization: `Bearer ${result.response?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...config.headers,
        };

        return config;
      } else {
        return {
          ...config,
          signal: controller.signal,
        };
      }
    }
    config.headers = {
      Authorization: `Bearer ${acccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.headers,
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
