import jwtDecode from 'jwt-decode';
// routes
import { PATH_AUTH } from '../routes/paths';
//
import axios from './axios';

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string, forwardSeconds: number) => {
  if (!accessToken) {
    return false;
  }
  try {
    const decoded = jwtDecode<{ exp: number }>(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp >= currentTime + forwardSeconds;
  } catch (err) {
    console.error('Error decoding JWT token:', accessToken, err);
    return false;
  }
};

const handleTokenExpired = (exp: number) => {
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    // TODO
    // Exchange the refreshToken to get a new one
    // const newToken1 = await client.exchangeRefreshTokenForJWT({
    //   refreshToken: response.response.refreshToken,
    // });
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

export const setSession = (accessToken: string | null, refreshToken: string | null) => {
  if (accessToken && refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    const { exp } = jwtDecode<{ exp: number }>(accessToken); // ~3 days by minimals server
    // handleTokenExpired(exp);
  } else {
    // localStorage.removeItem('accessToken');
    // delete axios.defaults.headers.common.Authorization;
  }
};
