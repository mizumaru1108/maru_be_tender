import { createSlice } from '@reduxjs/toolkit';
import { ClientUser } from '../../@types/client_data';
import { dispatch } from 'redux/store';
import graphQlAxiosInstance from 'utils/axisoGraphQlInstance';
import { getProfileData } from 'queries/client/getProfileData';
// ----------------------------------------------------------------------

interface ClientState {
  isLoading: boolean;
  error: Error | string | null;
  clientData: ClientUser;
  fillUpData: boolean;
}

const initialState: ClientState = {
  fillUpData: false,
  isLoading: false,
  error: null,
  clientData: {
    user_by_pk: {
      bank_informations: [
        {
          bank_account_name: '',
          bank_account_number: '',
          bank_name: '',
          card_image: '',
          id: '',
          proposal_id: '',
          user_id: '',
        },
      ],
      client_data: {
        authority: '',
        board_ofdec_file: [
          {
            size: 0,
            type: '',
            url: '',
          },
        ],
        center_administration: '',
        ceo_mobile: '',
        ceo_name: '',
        chairman_mobile: '',
        chairman_name: '',
        data_entry_mail: '',
        data_entry_mobile: '',
        data_entry_name: '',
        date_of_esthablistmen: '',
        entity: '',
        entity_mobile: '',
        governorate: '',
        headquarters: '',
        license_expired: '',
        license_file: {
          size: 0,
          type: '',
          url: '',
        },
        license_issue_date: '',
        license_number: '',
        num_of_beneficiaries: 0,
        num_of_employed_facility: 0,
        phone: '',
        region: '',
        twitter_acount: '',
        website: '',
      },
      email: '',
      status_id: '',
    },
    proposal_aggregate: {
      aggregate: {
        count: 0,
      },
    },
  },
};

const slice = createSlice({
  name: 'clientData',
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
    setClientData: (state, action) => {
      state.clientData = action.payload;
    },
    setFillUpData: (state, action) => {
      state.fillUpData = action.payload;
    },
  },
});

// ACTIONS
export const { setClientData, setFillUpData } = slice.actions;

// Reducer
export default slice.reducer;

export const getClientData = (id: string) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    const res = await graphQlAxiosInstance.post('', {
      query: getProfileData,
      variables: { id },
    });

    dispatch(slice.actions.setClientData(res.data.data));

    const {
      authority,
      date_of_esthablistmen,
      headquarters,
      num_of_employed_facility,
      num_of_beneficiaries,
      entity_mobile,
      license_number,
      license_issue_date,
      license_expired,
      license_file,
      board_ofdec_file,
      ceo_name,
      chairman_mobile,
      ceo_mobile,
      chairman_name,
      data_entry_name,
      data_entry_mobile,
      data_entry_mail,
    } = res.data.data.user_by_pk.client_data;

    if (
      !Object.values({
        authority,
        date_of_esthablistmen,
        headquarters,
        num_of_employed_facility,
        num_of_beneficiaries,
        entity_mobile,
        license_number,
        license_issue_date,
        license_expired,
        license_file,
        board_ofdec_file,
        ceo_name,
        chairman_mobile,
        ceo_mobile,
        chairman_name,
        data_entry_name,
        data_entry_mobile,
        data_entry_mail,
      }).some((val) => !val) &&
      res.data.data.user_by_pk.bank_informations.length !== 0
    ) {
      dispatch(setFillUpData(true));
    } else {
      dispatch(setFillUpData(false));
    }

    dispatch(slice.actions.endLoading);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
