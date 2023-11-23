import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from 'redux/store';
import axiosInstance from 'utils/axios';
import { BasePaginateQuery } from '../../@types/commons';

// ----------------------------------------------------------------------

export type LoadingPropsMobileSetting = {
  isLoading: boolean;
  stateLoading: boolean;
};

export type MobileSettingEntity = {
  id?: string;
  api_key: string;
  user_sender: string;
  username: string;
  is_active?: boolean;
  is_default?: boolean;
  is_deleted?: boolean;
};

interface UserState {
  mobile_setting: MobileSettingEntity;
  mobile_settings: MobileSettingEntity[];
  loadingProps: LoadingPropsMobileSetting;
  error: any;
  errorChangeState: any;
}

const initialState: UserState = {
  mobile_setting: {
    id: '',
    api_key: '',
    is_active: false,
    is_default: false,
    is_deleted: false,
    user_sender: '',
    username: '',
  },
  mobile_settings: [
    {
      id: '',
      api_key: '',
      is_active: false,
      is_default: false,
      is_deleted: false,
      user_sender: '',
      username: '',
    },
  ],
  loadingProps: {
    isLoading: false,
    stateLoading: false,
  },
  error: null,
  errorChangeState: null,
};

const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loadingProps.isLoading = action.payload;
    },
    setStateLoading(state, action) {
      state.loadingProps.stateLoading = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.loadingProps.isLoading = false;
      state.loadingProps.stateLoading = false;
      state.error = action.payload;
    },
    // SET MOBILE SETTING
    setMobileSetting(state, action) {
      state.mobile_setting = action.payload;
    },
    // SET MANY MOBILE SETTINGS
    setMobileSettings(state, action) {
      state.mobile_settings = action.payload;
    },
    // SET ERROR CHANGE STATE
    setErrorChangeState(state, action) {
      state.errorChangeState = action.payload;
    },
  },
});

// ACTIONS
export const { setMobileSettings, setMobileSetting, setErrorChangeState } = slice.actions;

// Reducer
export default slice.reducer;

export const getMobileSettings = (role: string, pagination?: BasePaginateQuery) => async () => {
  const params = {
    // is_deleted: 0,
    // include_relations: `count_budget`,
    // user_role: 'PROJECT_SUPERVISOR',
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
  };
  try {
    dispatch(slice.actions.setLoading(true));
    const response = await axiosInstance.get(`/sms-config`, {
      params: { ...params },
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setMobileSettings(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export const getMobileSettingById = (role: string, id: string) => async () => {
  try {
    dispatch(slice.actions.setLoading(true));
    const response = await axiosInstance.get(`/sms-config/${id}`, {
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setMobileSetting(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export const getOneMobileSetting = (role: string) => async () => {
  try {
    dispatch(slice.actions.setLoading(true));
    const response = await axiosInstance.get(`/sms-config/settings`, {
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setMobileSetting(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export type CreateMobileSettingProps = {
  api_key: string;
  user_sender: string;
  username: string;
};

export const createMobileSetting = (role: string, props: CreateMobileSettingProps) => async () => {
  try {
    dispatch(slice.actions.setStateLoading(true));
    const response = await axiosInstance.post(
      `/sms-config/create`,
      { ...props },
      {
        headers: { 'x-hasura-role': role },
      }
    );
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setMobileSetting(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.setErrorChangeState(error));
  } finally {
    dispatch(slice.actions.setStateLoading(false));
  }
};

export type UpdateMobileSettingProps = CreateMobileSettingProps & {
  id: string;
};

export const updateMobileSetting = (role: string, props: UpdateMobileSettingProps) => async () => {
  try {
    dispatch(slice.actions.setStateLoading(true));
    const response = await axiosInstance.patch(
      `/sms-config/update`,
      { ...props },
      {
        headers: { 'x-hasura-role': role },
      }
    );
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setMobileSetting(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.setErrorChangeState(error));
  } finally {
    dispatch(slice.actions.setStateLoading(false));
  }
};
