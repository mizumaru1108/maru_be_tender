import { createSlice } from '@reduxjs/toolkit';
import { TrackProps, TrackSection, UpdateTrackProps } from '../../@types/commons';
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
    total_spending_budget_by_ceo: 0,
    total_remaining_budget: 0,
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
    // include_relations: `track_sections,proposal`,
    include_relations: `count_budget`,
  };
  try {
    dispatch(slice.actions.setLoading(true));

    const response = await axiosInstance.get(`tender/track?is_deleted=0`, {
      params: { ...params },
      headers: { 'x-hasura-role': role },
    });
    if (response.data.statusCode === 200) {
      const tracks = response.data.data;

      const mapping = tracks.map((v: TrackProps) => {
        const totalBudget = v.total_budget ?? 0;
        const reservedBudget = v.total_reserved_budget ?? 0;
        // const spendBudget = v.total_spending_budget ?? 0;
        const spendBudgetCeo = v.total_spending_budget_by_ceo ?? 0;
        const remainBudget = totalBudget - (reservedBudget + spendBudgetCeo);

        return { ...v, total_remaining_budget: remainBudget };
      });

      dispatch(slice.actions.setTracks(mapping));
    }
    dispatch(slice.actions.setLoading(false));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getTracksById = (role: string, track_id: string) => async () => {
  const params = {
    include_relations: `count_budget`,
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
      const tmpValue: TrackProps = {
        ...response.data.data,
        sections: response?.data?.data?.sections.sort(
          (orderA: TrackSection, orderB: TrackSection) =>
            (orderB?.budget || 0) - (orderA?.budget || 0)
        ),
      };
      dispatch(slice.actions.setTrack(tmpValue));
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
