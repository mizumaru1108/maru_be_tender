import useAuth from 'hooks/useAuth';
import { createClient } from 'urql';

export const client = createClient({
  url: 'https://hasura-dev.tmra.io/v1/graphql',
  fetchOptions: () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});
