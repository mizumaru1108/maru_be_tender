import { createSlice } from '@reduxjs/toolkit';
// ----------------------------------------------------------------------

interface ActiveOptionSerachingAccountManagers {
  client_name: boolean;
  account_status: boolean;
  entity_name: boolean;
  entity_mobile: boolean;
  license_number: boolean;
  email: boolean;
}

export interface ActiveOptionsSearching {
  project_name: boolean;
  employee_name: boolean;
  project_track: boolean;
  project_number: boolean;
  outter_status: boolean;
}

interface FilteredState {
  filtered: string | null;
  sort: string | null;
  outter_status: string | null;
  activeOptions: ActiveOptionSerachingAccountManagers;
  activeOptionsSearching: ActiveOptionsSearching;
}

const initialState: FilteredState = {
  filtered: null,
  sort: 'asc',
  outter_status: null,
  activeOptions: {
    account_status: true,
    client_name: true,
    entity_name: true,
    entity_mobile: true,
    license_number: true,
    email: true,
  },
  activeOptionsSearching: {
    employee_name: true,
    project_name: true,
    project_number: true,
    project_track: true,
    outter_status: false,
  },
};

const slice = createSlice({
  name: 'searching',
  initialState,
  reducers: {
    setFiltered: (state, action) => {
      state.filtered = action.payload;
    },
    setOutterStatus: (state, action) => {
      state.outter_status = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setActiveOptionAccountManager: (state, action) => {
      state.activeOptions = action.payload;
    },
    setActiveOptionsSearching: (state, action) => {
      state.activeOptionsSearching = action.payload;
    },
  },
});

// ACTIONS
export const {
  setFiltered,
  setSort,
  setActiveOptionAccountManager,
  setActiveOptionsSearching,
  setOutterStatus,
} = slice.actions;

// Reducer
export default slice.reducer;
