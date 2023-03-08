import { createSlice } from '@reduxjs/toolkit';
// ----------------------------------------------------------------------

interface FilteredState {
  filtered: string | null;
  sort: string | null;
}

const initialState: FilteredState = {
  filtered: null,
  sort: 'asc',
};

const slice = createSlice({
  name: 'searching',
  initialState,
  reducers: {
    setFiltered: (state, action) => {
      state.filtered = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
  },
});

// ACTIONS
export const { setFiltered, setSort } = slice.actions;

// Reducer
export default slice.reducer;
