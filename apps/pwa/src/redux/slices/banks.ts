import { createSlice } from '@reduxjs/toolkit';
import { AuthorityInterface } from '../../sections/admin/bank-name/list/types';
// ----------------------------------------------------------------------

interface FilteredState {
  banks: AuthorityInterface[];
}

const initialState: FilteredState = {
  banks: [],
  // sort: 'asc',
};

const slice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    setBankList: (state, action) => {
      state.banks = action.payload;
    },
  },
});

// ACTIONS
export const { setBankList } = slice.actions;

// Reducer
export default slice.reducer;
