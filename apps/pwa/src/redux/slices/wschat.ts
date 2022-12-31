import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// utils
// import axios from '../../utils/axios';
// @types
import { ChatState, Conversation, IMassageGrouped } from '../../@types/wschat';

// ----------------------------------------------------------------------

const initialState: ChatState = {
  conversations: [],
  isEstablishingConnection: false,
  isConnected: false,
  activeConversationId: null,
  messageGrouped: [],
};

const slice = createSlice({
  name: 'wschat',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
    },
    setConversation: (state, action: PayloadAction<Conversation[] | []>) => {
      state.conversations = action.payload;
    },
    addMessageGrouped: (state, action: PayloadAction<IMassageGrouped>) => {
      state.messageGrouped?.push(action.payload);
    },
    setMessageGrouped: (state, action: PayloadAction<IMassageGrouped[] | []>) => {
      state.messageGrouped = action.payload;
    },
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
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
export const {
  addConversation,
  startConnecting,
  connectionEstablished,
  setActiveConversationId,
  setConversation,
  addMessageGrouped,
  setMessageGrouped,
} = slice.actions;

export const selectConversation = (state: ChatState) => state.conversations;

// Reducer
export default slice.reducer;
