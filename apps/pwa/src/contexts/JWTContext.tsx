import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { FUSIONAUTH_API } from 'config';
import { fusionAuthClient } from 'utils/fusionAuth';
import { FusionAuthRoles } from '../@types/commons';
import { datadogRum } from '@datadog/browser-rum';

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
    token?: string;
    refreshToken?: string;
  };
  [Types.Login]: {
    user: any;
    activeRole?: FusionAuthRoles;
    token?: string;
    refreshToken?: string;
  };
  // [Types.Logout]: undefined;
  [Types.Logout]: {
    activeRole?: FusionAuthRoles;
  };
  [Types.Register]: {
    user: AuthUser;
    activeRole?: FusionAuthRoles;
    token?: string;
    refreshToken?: string;
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
  token: null,
  refreshToken: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
        activeRole: action.payload.activeRole,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        activeRole: action.payload.activeRole,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const activeRoleIndex = Number(localStorage.getItem('activeRoleIndex'));
        if (accessToken && isValidToken(accessToken, 15)) {
          setSession(accessToken, refreshToken);
          const { user } = (await fusionAuthClient.retrieveUserUsingJWT(accessToken)).response;

          if (!user) {
            throw new Error(`Error getting currently active user`);
          }
          if (!user.registrations) {
            throw new Error(`User ${user?.id} does not have registrations`);
          }
          const userRegistration = user.registrations?.[0];
          const activeRole = userRegistration.roles?.[activeRoleIndex];
          if (!activeRole) {
            throw new Error(`User ${user?.id} must have valid activeRole`);
          }

          // Datadog RUM
          datadogRum.setUser({
            id: user?.id,
            name: user?.fullName,
            email: user?.email,
            role: activeRole,
            roles: userRegistration.roles,
          });

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
              activeRole: activeRole as FusionAuthRoles,
              token: accessToken,
              refreshToken: refreshToken!,
            },
          });

          // dispatchState(setAuthenticated(true));
          // dispatchState(setUser(user.response.user));
          // dispatchState(setActiveRole(user.response.user.registrations[0].roles[0]));
        } else if (accessToken && refreshToken && !isValidToken(accessToken, 15)) {
          const result = await fusionAuthClient.exchangeRefreshTokenForJWT({
            refreshToken: refreshToken,
          });
          if (result.response?.refreshToken && result.response?.token) {
            localStorage.setItem('accessToken', result.response.token);
            localStorage.setItem('refreshToken', result.response.refreshToken);
            const { user } = (await fusionAuthClient.retrieveUserUsingJWT(result.response.token))
              .response;
            if (!user) {
              throw new Error(`Error getting currently active user`);
            }
            if (!user.registrations) {
              throw new Error(`User ${user?.id} does not have registrations`);
            }
            const userRegistration = user.registrations?.[0];
            const activeRole = userRegistration.roles?.[activeRoleIndex];
            if (!activeRole) {
              throw new Error(`User ${user?.id} must have valid activeRole`);
            }

            // Datadog RUM
            datadogRum.setUser({
              id: user?.id,
              name: user?.fullName,
              email: user?.email,
              role: activeRole,
              roles: userRegistration.roles,
            });

            window.location.reload();
            dispatch({
              type: Types.Initial,
              payload: {
                isAuthenticated: true,
                user,
                activeRole: activeRole as FusionAuthRoles,
                token: result.response.token,
                refreshToken: result.response.refreshToken,
              },
            });

            // dispatchState(setAuthenticated(true));
          } else {
            datadogRum.clearUser();
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
          datadogRum.clearUser();
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error('Error initializing from localStorage', err);
        datadogRum.clearUser();
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
    const response = await fusionAuthClient.login({
      loginId: email,
      password: password,
      applicationId: FUSIONAUTH_API.appId,
    });
    // console.log('cek response:', response);
    const { token: accessToken, user, refreshToken } = response.response;
    const activeRoleIndex = 0;
    localStorage.setItem('activeRoleIndex', activeRoleIndex.toString());
    // console.log('cek response:', response?.response);
    if (!user) {
      throw new Error(`Error getting currently active user`);
    }
    if (!user.registrations) {
      throw new Error(`User ${user?.id} does not have registrations`);
    }
    if (response?.response?.user?.verified === false) {
      // throw new Error(`User ${email} does not have verified`);
      throw new Error(`حساب الشريك ${email} لم يتم تفعيله بعد`);
    }
    const userRegistration = user.registrations?.[0];
    const activeRole = userRegistration.roles?.[activeRoleIndex];
    if (!activeRole) {
      throw new Error(`User ${user?.id} must have valid activeRole`);
    }

    setSession(accessToken!, refreshToken!);

    // Datadog RUM
    datadogRum.setUser({
      id: user?.id,
      name: user?.fullName,
      email: user?.email,
      role: activeRole,
      roles: userRegistration.roles,
    });

    dispatch({
      type: Types.Login,
      payload: {
        user,
        activeRole: activeRole as FusionAuthRoles,
        token: accessToken,
        refreshToken: refreshToken,
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
    localStorage.removeItem('i18nextLng');
    localStorage.removeItem('activeRoleIndex');
    datadogRum.clearUser();
    dispatch({
      type: Types.Logout,
      payload: {
        activeRole: 'tender_client',
      },
    });
  };

  const changeActiveRole = (role: FusionAuthRoles) => {
    datadogRum.setUserProperty('role', role);
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
