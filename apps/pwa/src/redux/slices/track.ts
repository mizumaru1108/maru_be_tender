import { createSlice } from '@reduxjs/toolkit';
import { TrackProps, UpdateTrackProps } from '../../@types/commons';
import axiosInstance from 'utils/axios';
import { dispatch } from 'redux/store';

// ----------------------------------------------------------------------

interface TrackState {
  tracks: TrackProps[] | [];
  isLoading: boolean;
  error: Error | string | null;
}

const initialState: TrackState = {
  isLoading: false,
  error: null,
  tracks: [
    {
      id: '1',
      name: '',
      with_consultation: true,
      created_at: '01-01-2023',
      updated_at: '01-01-2023',
      is_deleted: false,
    },
  ],
};

const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // END LOADING
    endLoading(state) {
      state.isLoading = false;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    //SET TRACKS
    setTracks: (state, action) => {
      state.tracks = action.payload;
    },
  },
});

// ACTIONS
export const { setTracks } = slice.actions;

// Reducer
export default slice.reducer;

export const getTracks = (role: string) => async () => {
  try {
    dispatch(slice.actions.startLoading);

    const response = await axiosInstance.get(`tender/track?is_deleted=0`, {
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setTracks(response.data.data));
    }
    dispatch(slice.actions.endLoading);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const updateTrack = (payload: UpdateTrackProps, role: string) => async () => {
  try {
    dispatch(slice.actions.startLoading);

    const response = await axiosInstance.patch(`tender/track/update`, payload, {
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setTracks(response.data.data));
    }
    dispatch(slice.actions.endLoading);
    dispatch(getTracks(role));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
