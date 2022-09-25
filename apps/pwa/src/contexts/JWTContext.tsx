import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { FUSIONAUTH_API } from 'config';
// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: any;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const client = new FusionAuthClient(
    FUSIONAUTH_API.clientKey!,
    FUSIONAUTH_API.apiUrl!,
    FUSIONAUTH_API.tenantId!
  );

  // FusionAuthClient

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const user = await client.retrieveUserUsingJWT(accessToken);
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: user.response.user!,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
    // eslint-disable-next-line
  }, []);

  const login = async (email: string, password: string) => {
    const response = await client.login({
      loginId: email,
      password: password,
      applicationId: FUSIONAUTH_API.appId,
    });

    const { token: accessToken, user } = response.response;
    // const newToken1 = await client.exchangeRefreshTokenForJWT({
    //   refreshToken: response.response.refreshToken,
    // });

    setSession(accessToken!);

    dispatch({
      type: Types.Login,
      payload: {
        user,
      },
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // const response = await axios.post('/api/account/register', {
    //   email,
    //   password,
    //   firstName,
    //   lastName,
    // });
    // const { accessToken, user } = response.data;
    // localStorage.setItem('accessToken', accessToken);
    // dispatch({
    //   type: Types.Register,
    //   payload: {
    //     user,
    //   },
    // });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
