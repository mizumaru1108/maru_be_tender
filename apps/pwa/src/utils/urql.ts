import { HASURA_GRAPHQL_URL } from 'config';
import { createClient } from 'urql';

export const client = createClient({
  url: HASURA_GRAPHQL_URL,
  fetchOptions: () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
  requestPolicy: 'cache-and-network',
});
