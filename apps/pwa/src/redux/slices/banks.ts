import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { dispatch } from 'redux/store';
import { BankReduxProps } from '../../@types/commons';
import { AuthorityInterface } from '../../sections/admin/bank-name/list/types';
// ----------------------------------------------------------------------

interface FilteredState {
  banks: BankReduxProps[];
  isLoading: boolean;
  error: Error | string | null;
}

const initialState: FilteredState = {
  banks: [
    // {
    //   id: '-1',
    //   bank_name: 'test',
    //   is_deleted: false,
    //   created_at: new Date('2022-01-01'),
    //   updated_at: new Date('2022-01-01'),
    // },
  ],
  isLoading: false,
  error: null,
  // sort: 'asc',
};

const slice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    setBankList: (state, action) => {
      state.banks = action.payload;
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
export const { setBankList } = slice.actions;

export const getBankList = () => async () => {
  try {
    dispatch(slice.actions.startLoading(true));

    const response = await axios.get(
      `${TMRA_RAISE_URL}/tender/proposal/payment/find-bank-list?limit=0`
    );
    // console.log({ response });
    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      dispatch(slice.actions.setBankList(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.startLoading(false));
  }
};

// Reducer
export default slice.reducer;
