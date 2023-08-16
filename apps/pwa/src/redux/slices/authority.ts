import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { dispatch } from 'redux/store';
import { AuthorityReduxProps } from '../../@types/commons';
// ----------------------------------------------------------------------

interface FilteredState {
  authorities: AuthorityReduxProps[];
  isLoading: boolean;
  error: Error | string | null;
}

const initialState: FilteredState = {
  authorities: [],
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'authorities',
  initialState,
  reducers: {
    setAuthorityFields: (state, action) => {
      state.authorities = action.payload;
    },
    // START LOADING
    startLoading(state, action) {
      state.isLoading = action.payload;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// ACTIONS
export const { setAuthorityFields } = slice.actions;

export const getAuthorityList = () => async () => {
  try {
    dispatch(slice.actions.startLoading(true));

    const response = await axios.get(`${TMRA_RAISE_URL}/authority-management/authorities?limit=0`);
    // console.log({ response });
    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      dispatch(slice.actions.setAuthorityFields(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.startLoading(false));
  }
};

// Reducer
export default slice.reducer;
