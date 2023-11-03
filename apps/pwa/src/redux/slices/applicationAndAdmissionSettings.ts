import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from 'redux/store';
import axiosInstance from 'utils/axios';
import { AdmissionProps } from '../../@types/commons';

// ----------------------------------------------------------------------

interface State {
  isLoading: boolean;
  application_admission_settings: AdmissionProps;
  error: any;
}

const initialState: State = {
  isLoading: false,
  error: null,
  application_admission_settings: {
    applying_status: false,
    ending_date: new Date().toISOString(),
    starting_date: new Date().toISOString(),
    hieght_project_budget: 0,
    indicator_of_project_duration_days: 0,
    number_of_days_to_meet_business: 0,
    number_of_allowing_projects: 0,
  },
};

const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    // STATE ISLOADING
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // SET STATE APPLICATION ADMISSION SETTINGS
    setApplicationAdmissionSettings(state, action) {
      state.application_admission_settings = action.payload;
    },
  },
});

// ACTIONS
export const { setApplicationAdmissionSettings } = slice.actions;

// Reducer
export default slice.reducer;

export const getApplicationAdmissionSettings = (role: string) => async () => {
  try {
    dispatch(slice.actions.setLoading(true));

    const response = await axiosInstance.get(`proposal/aa`, {
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setApplicationAdmissionSettings(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};
