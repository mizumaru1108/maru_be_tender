// @mui
import { enUS, arSD } from '@mui/material/locale';
// components
import { SettingsValueProps } from './components/settings/type';
// routes
import { PATH_DASHBOARD } from './routes/paths';

export const HASURA_GRAPHQL_URL = process.env.REACT_APP_HASURA_GRAPHQL_URL!;
export const HASURA_ADMIN_SECRET = process.env.REACT_APP_HASURA_ADMIN_SECRET!;

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.REACT_APP_HOST_API_KEY || '';

export const TMRA_RAISE_URL = process.env.REACT_APP_TMRA_RAISE_URL;

export const UPDATE_PROPOSAL_FROM_BACKEND = process.env.REACT_APP_UPDATE_PROPOSAL_FROM_BACKEND;

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
export const FUSIONAUTH_API = {
  clientKey: process.env.REACT_APP_FUSIONAUTH_CLIENT_KEY,
  apiUrl: process.env.REACT_APP_FUSIONAUTH_URL,
  tenantId: process.env.REACT_APP_FUSIONAUTH_TENANT_ID,
  appId: process.env.REACT_APP_FUSIONAUTH_APP_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app; // as '/dashboard/app'
// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 80,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 250,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const defaultSettings: SettingsValueProps = {
  themeMode: 'light',
  themeDirection: 'rtl',
  themeContrast: 'default',
  themeLayout: 'horizontal',
  themeColorPresets: 'default',
  themeStretch: false,
};

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    label: 'Arabic',
    value: 'ar',
    systemValue: arSD,
    icon: '/assets/icons/flags/ic_flag_sa.svg',
  },
];

export const defaultLang = allLangs[1]; // Arabic

/**
 * CONFIGURATION FOR FEATURES FLAG DEPLOYMENT
 */

export const FEATURE_SIGNUP: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_SIGNUP &&
  process.env.REACT_APP_CONFIG_FEATURE_SIGNUP === 'true'
    ? true
    : false;

export const FEATURE_NEW_EMPLOYEE: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_NEW_EMPLOYEE &&
  process.env.REACT_APP_CONFIG_FEATURE_NEW_EMPLOYEE === 'true'
    ? true
    : false;

export const FEATURE_EDIT_PROFILE_BY_ADMIN: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_EDIT_PROFILE_BY_ADMIN &&
  process.env.REACT_APP_CONFIG_FEATURE_EDIT_PROFILE_BY_ADMIN === 'true'
    ? true
    : false;

export const FEATURE_EDIT_CLIENT_INFORMATION: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_EDIT_CLIENT_INFORMATION &&
  process.env.REACT_APP_CONFIG_FEATURE_EDIT_CLIENT_INFORMATION === 'true'
    ? true
    : false;

export const FEATURE_MESSAGING_SYSTEM: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_MESSAGING_SYSTEM &&
  process.env.REACT_APP_CONFIG_FEATURE_MESSAGING_SYSTEM === 'true'
    ? true
    : false;

export const FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL &&
  process.env.REACT_APP_CONFIG_FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL === 'true'
    ? true
    : false;

export const FEATURE_PORTAL_REPORTS: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_PORTAL_REPORTS &&
  process.env.REACT_APP_CONFIG_FEATURE_PORTAL_REPORTS === 'true'
    ? true
    : false;

// Enable daily status
export const FEATURE_DAILY_STATUS: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_DAILY_STATUS &&
  process.env.REACT_APP_CONFIG_FEATURE_DAILY_STATUS === 'true'
    ? true
    : false;

export const FEATURE_NOTIFICATION_SYSTEM: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_NOTIFICATION_SYSTEM &&
  process.env.REACT_APP_CONFIG_FEATURE_NOTIFICATION_SYSTEM === 'true'
    ? true
    : false;

export const FEATURE_PROJECT_DETAILS: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_PROJECT_DETAILS &&
  process.env.REACT_APP_CONFIG_FEATURE_PROJECT_DETAILS === 'true'
    ? true
    : false;

export const FEATURE_PROJECT_SAVE_DRAFT: boolean =
  process.env.REACT_APP_CONFIG_FEATURE_PROJECT_SAVE_DRAFT &&
  process.env.REACT_APP_CONFIG_FEATURE_PROJECT_SAVE_DRAFT === 'true'
    ? true
    : false;
