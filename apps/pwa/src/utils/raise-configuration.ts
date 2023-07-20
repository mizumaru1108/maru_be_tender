import { TMRA_RAISE_URL } from 'config';
import jwtDecode from 'jwt-decode';
import { Configuration } from 'raise-sdk';
import { fusionAuthClient } from 'utils/fusionAuth';

export const raiseConfiguration = new Configuration({
  basePath: TMRA_RAISE_URL,
});

export async function getRaiseConfiguration(role: string) {
  // const accesT
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
    }
  }
  return new Configuration({
    basePath: TMRA_RAISE_URL,
    baseOptions: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'x-hasura-role': role,
      },
    },
  });
}

// raiseConfiguration.baseOptions = as
