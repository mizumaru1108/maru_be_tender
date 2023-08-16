import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { dispatch } from 'redux/store';
import { ClientFieldReduxProps } from '../../@types/commons';
// ----------------------------------------------------------------------

interface FilteredState {
  clientFields: ClientFieldReduxProps[];
  selectedClientFields: string;
  isLoading: boolean;
  error: Error | string | null;
}

const initialState: FilteredState = {
  clientFields: [],
  selectedClientFields: '',
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'clientFields',
  initialState,
  reducers: {
    setClientFields: (state, action) => {
      state.clientFields = action.payload;
    },
    setSelectedClientFields: (state, action) => {
      state.selectedClientFields = action.payload;
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
export const { setClientFields } = slice.actions;

export const getClientFieldList = () => async () => {
  try {
    dispatch(slice.actions.startLoading(true));

    const response = await axios.get(
      `${TMRA_RAISE_URL}/authority-management/client-fields?limit=0`
    );
    // console.log({ response });
    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      dispatch(slice.actions.setClientFields(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.startLoading(false));
  }
};

// Reducer
export default slice.reducer;
