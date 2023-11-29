import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from 'redux/store';
import axiosInstance from 'utils/axios';
import { BasePaginateQuery } from '../../@types/commons';

// ----------------------------------------------------------------------

type GregorianYearPagination = {
  year?: string;
} & BasePaginateQuery;

export type LoadingPropsGregorianYear = {
  isLoading: boolean;
  stateLoading: boolean;
};

export type GregorianYearEntity = {
  id?: string;
  year: number;
};

interface GregorianYearState {
  gregorian_year: GregorianYearEntity;
  gregorian_years: GregorianYearEntity[];
  loadingProps: LoadingPropsGregorianYear;
  error: any;
  errorChangeState: any;
}

const initialState: GregorianYearState = {
  gregorian_year: {
    id: '',
    year: 0,
  },
  gregorian_years: [],
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
      state.error = action.payload;
    },
    // SET GREGORIAN YEAR
    setGregorianYear(state, action) {
      state.gregorian_year = action.payload;
    },
    // SET GREGORIAN YEARS
    setGregorianYears(state, action) {
      state.gregorian_years = action.payload;
    },
    // SET ERROR CHANGE STATE
    setErrorChangeState(state, action) {
      state.errorChangeState = action.payload;
    },
  },
});

// ACTIONS
export const { setGregorianYear, setGregorianYears, setErrorChangeState, setStateLoading } =
  slice.actions;

// Reducer
export default slice.reducer;

export const getGregorianYears =
  (role: string, pagination?: GregorianYearPagination) => async () => {
    const params = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      year: pagination?.year || undefined,
    };
    try {
      dispatch(slice.actions.hasError(null));
      dispatch(slice.actions.setLoading(true));
      const response = await axiosInstance.get(`/gregorian-years`, {
        params: { ...params },
        headers: { 'x-hasura-role': role },
      });
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.setGregorianYears(response.data.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    } finally {
      dispatch(slice.actions.setLoading(false));
    }
  };

export const getGregorianYearById = (role: string, id: string) => async () => {
  try {
    dispatch(slice.actions.hasError(null));
    dispatch(slice.actions.setLoading(true));
    const response = await axiosInstance.get(`/gregorian-year/${id}`, {
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setGregorianYear(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    throw error;
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export const getOneGregorianYear = (role: string) => async () => {
  try {
    dispatch(slice.actions.hasError(null));
    dispatch(slice.actions.setLoading(true));
    const response = await axiosInstance.get(`/gregorian-year/find-settings`, {
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setGregorianYear(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    throw error;
  } finally {
    dispatch(slice.actions.setLoading(false));
  }
};

export type CreateGregorianYearProps = {
  year: string;
};

export const createGregorianYear = (role: string, props: CreateGregorianYearProps) => async () => {
  try {
    dispatch(slice.actions.setStateLoading(true));
    const response = await axiosInstance.post(
      `/gregorian-year/create`,
      { ...props },
      {
        headers: { 'x-hasura-role': role },
      }
    );
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setGregorianYear(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.setErrorChangeState(error));
    throw error;
  } finally {
    dispatch(slice.actions.setStateLoading(false));
  }
};

export type UpdateGregorianYearProps = CreateGregorianYearProps & {
  id: string;
};

export const updateGregorianYear = (role: string, props: UpdateGregorianYearProps) => async () => {
  try {
    dispatch(slice.actions.setStateLoading(true));
    const response = await axiosInstance.patch(
      `/gregorian-year/create`,
      { ...props },
      {
        headers: { 'x-hasura-role': role },
      }
    );
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setGregorianYear(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.setErrorChangeState(error));
    throw error;
  } finally {
    dispatch(slice.actions.setStateLoading(false));
  }
};

export const deleteGregorianYear = (role: string, id: string) => async () => {
  try {
    dispatch(slice.actions.setStateLoading(true));
    const response = await axiosInstance.delete(`/gregorian-year/${id}`, {
      headers: { 'x-hasura-role': role },
    });
  } catch (error) {
    dispatch(slice.actions.setErrorChangeState(error));
  } finally {
    dispatch(slice.actions.setStateLoading(false));
  }
};
