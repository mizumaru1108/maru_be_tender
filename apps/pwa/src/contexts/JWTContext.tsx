import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { FUSIONAUTH_API } from 'config';
import { fusionAuthClient } from 'utils/fusionAuth';
import { FusionAuthRoles } from '../@types/commons';
// redux
import { useDispatch, useSelector } from 'redux/store';
import { setAuthenticated, setUser, setActiveRole } from 'redux/slices/auth';
//

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
  Switch_Active_Role = 'SWITCH_ACTIVE_ROLE',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
    activeRole?: FusionAuthRoles;
  };
  [Types.Login]: {
    user: any;
    activeRole?: FusionAuthRoles;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
    activeRole?: FusionAuthRoles;
  };
  [Types.Switch_Active_Role]: {
    activeRole?: FusionAuthRoles;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  activeRole: 'tender_client',
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
        activeRole: action.payload.activeRole,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        activeRole: action.payload.activeRole,
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
    case 'SWITCH_ACTIVE_ROLE':
      return {
        ...state,
        activeRole: action.payload.activeRole,
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

  // const dispatchState = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken, refreshToken);
          const user = (await fusionAuthClient.retrieveUserUsingJWT(accessToken)) as {
            response: { user: { registrations: Array<{ roles: Array<FusionAuthRoles> }> } };
          };
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: user.response.user,
              activeRole: user.response.user.registrations[0].roles[0],
            },
          });

          // dispatchState(setAuthenticated(true));
          // dispatchState(setUser(user.response.user));
          // dispatchState(setActiveRole(user.response.user.registrations[0].roles[0]));
        } else if (accessToken && refreshToken && !isValidToken(accessToken)) {
          const result = await fusionAuthClient.exchangeRefreshTokenForJWT({
            refreshToken: refreshToken,
          });
          if (result.response?.refreshToken && result.response?.token) {
            localStorage.setItem('accessToken', result.response.token);
            localStorage.setItem('refreshToken', result.response.refreshToken);
            const user = (await fusionAuthClient.retrieveUserUsingJWT(result.response.token)) as {
              response: { user: { registrations: Array<{ roles: Array<FusionAuthRoles> }> } };
            };

            window.location.reload();
            dispatch({
              type: Types.Initial,
              payload: {
                isAuthenticated: true,
                user: user.response.user,
                activeRole: user.response.user.registrations[0].roles[0],
              },
            });

            // dispatchState(setAuthenticated(true));
          } else {
            dispatch({
              type: Types.Initial,
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });

            // dispatchState(setAuthenticated(false));
          }
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });

          // dispatchState(setAuthenticated(false));
        }
      } catch (err) {
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
    const response = (await fusionAuthClient.login({
      loginId: email,
      password: password,
      applicationId: FUSIONAUTH_API.appId,
    })) as {
      response: {
        user: { registrations: Array<{ roles: Array<FusionAuthRoles> }> };
        refreshToken: string;
        token: string;
      };
    };
    const { token: accessToken, user, refreshToken } = response.response;

    setSession(accessToken!, refreshToken!);
    dispatch({
      type: Types.Login,
      payload: {
        user,
        activeRole: response.response.user.registrations[0].roles[0],
      },
    });

    // dispatchState(setAuthenticated(true));
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {};

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    dispatch({ type: Types.Logout });
  };

  const changeActiveRole = (role: FusionAuthRoles) => {
    dispatch({
      type: Types.Switch_Active_Role,
      payload: {
        activeRole: role,
      },
    });
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        changeActiveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
