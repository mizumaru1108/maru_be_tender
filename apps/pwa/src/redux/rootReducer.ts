import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from './slices/auth';
import authority from './slices/authority';
import banks from './slices/banks';
import clientData from './slices/clientData';
import clientField from './slices/clientField';
import notification from './slices/notification';
import proposal from './slices/proposal';
import searching from './slices/searching';
import supervisorAcceptingForm from './slices/supervisorAcceptingForm';
import tracks from './slices/track';
import wschatReducer from './slices/wschat';
import applicationAndAdmissionSettings from './slices/applicationAndAdmissionSettings';
import user from './slices/user';
import mobileSettings from './slices/mobile-settings';
import gregorianYear from './slices/gregorian-year';

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
  notification: notification,
  searching: searching,
  tracks: tracks,
  clientData: clientData,
  banks: banks,
  clientFields: clientField,
  authorities: authority,
  supervisorAcceptingForm: supervisorAcceptingForm,
  applicationAndAdmissionSettings: applicationAndAdmissionSettings,
  user: user,
  mobileSetting: mobileSettings,
  gregorianYear: gregorianYear,
});

export { rootPersistConfig, rootReducer };
