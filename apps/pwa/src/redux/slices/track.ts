import { createSlice } from '@reduxjs/toolkit';
import { TrackProps, UpdateTrackProps } from '../../@types/commons';
import axiosInstance from 'utils/axios';
import { dispatch } from 'redux/store';

// ----------------------------------------------------------------------

interface TrackState {
  tracks: TrackProps[] | [];
  track: TrackProps;
  isLoading: boolean;
  error: any;
}

const initialState: TrackState = {
  isLoading: false,
  error: null,
  track: {
    id: '-1',
    created_at: '01-01-2023',
    updated_at: '01-01-2023',
    is_deleted: false,
    name: 'test',
    with_consultation: false,
    total_budget: 0,
    total_spending_budget: 0,
    total_reserved_budget: 0,
  },
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
    // STATE ISLOADING
    setLoading(state, action) {
      state.isLoading = action.payload;
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
    //SET TRACK
    setTrack: (state, action) => {
      state.track = action.payload;
    },
  },
});

// ACTIONS
export const { setTracks, setTrack } = slice.actions;

// Reducer
export default slice.reducer;

export const getTracks = (role: string) => async () => {
  const params = {
    include_relations: `track_sections,proposal`,
  };
  try {
    dispatch(slice.actions.startLoading);

    const response = await axiosInstance.get(`tender/track?is_deleted=0`, {
      params: { ...params },
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

export const getTracksById = (role: string, track_id: string) => async () => {
  const params = {
    include_relations: `track_sections,proposal`,
  };
  dispatch(slice.actions.setLoading(true));
  try {
    const response = await axiosInstance.get(`/tender/track/${track_id}`, {
      params: {
        ...params,
      },
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      dispatch(slice.actions.setTrack(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    // throw new Error(error);
  } finally {
    dispatch(slice.actions.setLoading(false));
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
