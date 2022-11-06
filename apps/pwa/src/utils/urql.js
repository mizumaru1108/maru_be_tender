import { HASURA_GRAPHQL_URL } from 'config';
import { createClient, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import { makeOperation } from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import { fusionAuthClient } from 'utils/fusionAuth';
import jwtDecode from 'jwt-decode';

export const makeClient = () =>
  createClient({
    url: HASURA_GRAPHQL_URL,
    exchanges: [
      dedupExchange,
      // cacheExchange,
      authExchange({
        addAuthToOperation: ({ authState, operation }) => {
          // the token isn't in the auth state, return the operation without changes
          if (!authState || !authState.token) {
            return operation;
          }
          // fetchOptions can be a function (See Client API) but you can simplify this based on usage
          const fetchOptions =
            typeof operation.context.fetchOptions === 'function'
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions || {};

          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Authorization: authState.token,
              },
            },
          });
        },
        willAuthError: ({ authState }) => {
          const token = authState?.token;
          if (!authState || jwtDecode(token)?.exp < Date.now() / 1000) {
            return true;
          }
          // e.g. check for expiration, existence of auth etc
          return false;
        },
        didAuthError: ({ error }) =>
          // check if the error was an auth error (this can be implemented in various ways, e.g. 401 or a special error code)
          error.graphQLErrors.some((e) => e.extensions?.code === 'FORBIDDEN'),
        getAuth: async ({ authState, mutate }) => {
          if (!authState) {
            const token = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (token && refreshToken) {
              return { token: `Bearer ${token}`, refreshToken };
            }
            return null;
          }
          const refreshToken = localStorage.getItem('refreshToken');
          const result = await fusionAuthClient.exchangeRefreshTokenForJWT({
            refreshToken,
          });
          if (result.response?.refreshToken) {
            localStorage.setItem('accessToken', result.response?.token);
            localStorage.setItem('refreshToken', result.response?.refreshToken);
            return {
              token: `Bearer ${result.response.token}`,
              refreshToken: result.response.refreshLogin,
            };
          }
          localStorage.clear();
          return null;
        },
      }),
      fetchExchange,
    ],
  });
