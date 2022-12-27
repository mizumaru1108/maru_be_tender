import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// utils
// import axios from '../../utils/axios';
// @types
import { ChatState, Conversation } from '../../@types/wschat';

// ----------------------------------------------------------------------

const initialState: ChatState = {
  conversations: [],
  isEstablishingConnection: false,
  isConnected: false,
};

const slice = createSlice({
  name: 'wschat',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
    },
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },
  },
});

// ACTIONS
export const { addConversation, startConnecting, connectionEstablished } = slice.actions;

export const selectConversation = (state: ChatState) => state.conversations;

// Reducer
export default slice.reducer;
