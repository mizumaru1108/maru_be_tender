import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import authReducer from './slices/auth';
import wschatReducer from './slices/wschat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import branchReducer from './slices/branch';
import proposal from './slices/proposal';
import supervisorAcceptingForm from './slices/supervisorAcceptingForm';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  // mail: mailReducer,
  // chat: chatReducer,
  auth: authReducer,
  wschat: wschatReducer,
  // calendar: calendarReducer,
  // kanban: kanbanReducer,
  // product: persistReducer(productPersistConfig, productReducer),
  // branch: branchReducer,
  proposal: proposal,
  supervisorAcceptingForm: supervisorAcceptingForm,
});

export { rootPersistConfig, rootReducer };
