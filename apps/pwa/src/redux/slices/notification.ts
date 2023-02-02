import { createSlice } from '@reduxjs/toolkit';
import { getOneProposal } from 'queries/commons/getOneProposal';
import { insertPayments } from 'queries/project-supervisor/insertPayments';
import { dispatch } from 'redux/store';
import graphQlAxiosInstance from 'utils/axisoGraphQlInstance';
import { Notifications } from '../../@types/notification';
import { updatePayment } from 'queries/project-supervisor/updatePayment';
import { insertChequeUpdatePayment } from 'queries/Cashier/insertChequeUpdatePayment';
import { createNewFollowUp } from 'queries/commons/createNewFollowUp';
import axiosInstance from 'utils/axios';

// ----------------------------------------------------------------------

interface NotificationItem {
  isLoading: boolean;
  error: Error | string | null;
  notifyCount: number;
  notifications: Notifications;
}

const initialState: NotificationItem = {
  isLoading: false,
  error: null,
  notifyCount: 0,
  notifications: {
    id: '',
    appointment_id: '',
    subject: '',
    content: '',
    read_status: false,
    created_at: new Date('10-01-2023'),
    type: '',
    proposal: {
      id: '',
      inner_status: '',
      outter_status: '',
      state: '',
      payments: [],
    },
    appointment: {
      id: '',
      calendar_url: '',
      meeting_url: '',
      client: {
        id: '',
        employee_name: '',
        email: '',
        created_at: '',
        client_data: {
          entity: '',
          authority: '',
        },
      },
    },
  },
};

const slice = createSlice({
  name: 'notifications',
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
    // SET NOTIFICATION
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    // SET NOTIFICATION
    setNotifyCount(state, action) {
      state.notifyCount = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setNotifications, setNotifyCount } = slice.actions;
