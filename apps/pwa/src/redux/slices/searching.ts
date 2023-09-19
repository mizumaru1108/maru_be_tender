import { createSlice } from '@reduxjs/toolkit';
// ----------------------------------------------------------------------

interface ActiveOptionSerachingAccountManagers {
  client_name: boolean;
  account_status: boolean;
  entity_name: boolean;
}

interface FilteredState {
  filtered: string | null;
  sort: string | null;
  activeOptions: ActiveOptionSerachingAccountManagers;
}

const initialState: FilteredState = {
  filtered: null,
  sort: 'asc',
  activeOptions: {
    account_status: true,
    client_name: true,
    entity_name: true,
  },
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
    setActiveOptionAccountManager: (state, action) => {
      state.activeOptions = action.payload;
    },
  },
});

// ACTIONS
export const { setFiltered, setSort, setActiveOptionAccountManager } = slice.actions;

// Reducer
export default slice.reducer;
