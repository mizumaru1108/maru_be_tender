import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '../../@types/auth';
import { FusionAuthRoles } from '../../@types/commons';
// ----------------------------------------------------------------------

interface AuthSliceState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  activeRole?: FusionAuthRoles | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthSliceState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  activeRole: null,
  accessToken: null,
  refreshToken: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    setActiveRole: (state, action: PayloadAction<FusionAuthRoles>) => {
      state.activeRole = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.isInitialized = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
  },
});

// ACTIONS
export const { setUser, setActiveRole, setAuthenticated, setAccessToken, setRefreshToken } =
  slice.actions;

// Reducer
export default slice.reducer;
