import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from 'redux/store';
import axiosInstance from 'utils/axios';

// ----------------------------------------------------------------------

export type UserEntity = {
  id: string;
  employee_name: string | null;
  mobile_number: string | null;
  email: string;
  updated_at: Date | null;
  created_at: Date | null;
  employee_path: string | null;
  last_login: Date | null;
  status_id: string;
  address: string | null;
  is_online: boolean | null;
  track_id: string | null;
  uid: number | null;
  deleted_at: Date | null;
  roles: {
    user_type_id: string;
  }[];
};

type Employee = {
  tender_project_supervisor: UserEntity[];
};

interface UserState {
  user: any;
  employee: Employee;
  isLoading: boolean;
  error: any;
}

const initialState: UserState = {
  user: {},
  employee: {
    tender_project_supervisor: [],
  },
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // SET USER
    setSupervisors(state, action) {
      state.employee.tender_project_supervisor = action.payload;
    },
  },
});

// ACTIONS
export const { setSupervisors } = slice.actions;

// Reducer
export default slice.reducer;

export const getManySupervisor = (role: string, track_id?: string) => async () => {
  const params = {
    // is_deleted: 0,
    // include_relations: `count_budget`,
    // user_role: 'PROJECT_SUPERVISOR',
    track_id: track_id || undefined,
    limit: 999,
    user_type_id: 'PROJECT_SUPERVISOR',
  };
  try {
    dispatch(slice.actions.setLoading(true));
    const response = await axiosInstance.get(`/tender-user/find-users`, {
      params: { ...params },
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setSupervisors(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};
