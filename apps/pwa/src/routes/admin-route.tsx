import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';
import CeoClientListPage from 'pages/ceo/CeoClientListPage';
import ProjectOwnerDetails from 'pages/project-details/ProjectOwnerDetails';
import ProjectDetails from 'pages/project-details/ProjectDetails';
import ListTrack from 'sections/admin/transaction-progression/ListTrack';
import ReviewOperationTrack from 'sections/admin/transaction-progression/ReviewOperationTrack';
import {
  FEATURE_CONTACT_US_BY_CLIENT,
  FEATURE_MENU_ADMIN_ADD_AUTHORITY,
  FEATURE_MENU_ADMIN_APLICATION_ADMISSION,
  FEATURE_MENU_ADMIN_ENTITY_AREA,
  FEATURE_MENU_ADMIN_ENTITY_CLASSIFICATION,
  FEATURE_MENU_ADMIN_MOBILE_SETTINGS,
  FEATURE_MENU_ADMIN_REGIONS,
  FEATURE_MENU_CLIENT_FILES,
  FEATURE_NESTED_TRACK_BUDGET,
  MENU_ADMIN_PORTAL_REPORTS,
} from 'config';

const Main = Loadable(lazy(() => import('pages/admin/MainPage')));
const TransactionProgression = Loadable(lazy(() => import('pages/admin/TransactionProgression')));
const TracksBudget = Loadable(lazy(() => import('pages/admin/TracksBudget')));
const GregorianYear = Loadable(lazy(() => import('pages/admin/GregorianYear')));
const ApplicationAndAdmissionSettings = Loadable(
  lazy(() => import('pages/admin/ApplicationAndAdmissionSettings'))
);
// don't delete for now
// const MobileSettings = Loadable(lazy(() => import('pages/admin/MobileSetttings')));
// const MobileSettingsForm = Loadable(lazy(() => import('pages/admin/MobileSetttings/form')));
const MobileSettings = Loadable(lazy(() => import('pages/admin/MobileSetttings/form')));
//
const SystemMessages = Loadable(lazy(() => import('pages/admin/SystemMessages')));
const SystemMessagesInternalForm = Loadable(
  lazy(() => import('pages/admin/SystemMessages/InternalForm'))
);
const SystemMessagesExternalForm = Loadable(
  lazy(() => import('pages/admin/SystemMessages/ExternalForm'))
);
const SystemConfiguration = Loadable(lazy(() => import('pages/admin/SystemConfiguration')));
const UsersAndPermissions = Loadable(lazy(() => import('pages/admin/UsersAndPermissions')));
const UsersAndPermissionsAdd = Loadable(lazy(() => import('pages/admin/UsersAndPermissionsAdd')));
const UsersAndPermissionsEdit = Loadable(lazy(() => import('pages/admin/UsersAndPermissionsAdd')));
const Authority = Loadable(lazy(() => import('pages/admin/Authority')));
const EntityArea = Loadable(lazy(() => import('pages/admin/EntityArea')));
const RegionsProjectLocation = Loadable(lazy(() => import('pages/admin/RegionsProjectLocation')));
const EntityClassification = Loadable(lazy(() => import('pages/admin/EntityClassification')));
const BankName = Loadable(lazy(() => import('pages/admin/BankName')));
const Beneficiaries = Loadable(lazy(() => import('pages/admin/Beneficiaries')));

// const PortalReports = Loadable(lazy(() => import('pages/PortalReports')));
const PortalReports = Loadable(lazy(() => import('pages/admin/PortalReports')));
const Messages = Loadable(lazy(() => import('pages/admin/Messages')));

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const SectionTracks = Loadable(
  lazy(() => import('sections/admin/track-budget/section-track/SectionTracks'))
);
const NewSectionTracks = Loadable(
  lazy(() => import('sections/admin/track-budget/section-track/NewSectionTracks'))
);
const ViewNewSectionTracks = Loadable(
  lazy(() => import('sections/admin/track-budget/section-track/ViewNewSectionTracks'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));

const OldProposal = Loadable(lazy(() => import('pages/admin/OldProposal')));
const ClientFiles = Loadable(lazy(() => import('pages/client-files/ClientFiles')));
const ContactUs = Loadable(lazy(() => import('pages/admin/ContactUs')));
const ApplicationAdmission = Loadable(
  lazy(() => import('pages/admin/ApplicationAndAdmissionSettings'))
);

export const adminRoute = {
  path: 'admin',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_admin']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/cashier/dashboard/app" replace />, index: true },
    {
      path: 'my-profile',
      children: [
        { path: '', element: <NonClientProfile /> },
        { path: 'edit', element: <NonClientProfileEdit /> },
      ],
    },
    {
      path: 'searching',
      children: [
        { path: '', element: <Searching /> },
        {
          path: ':id/:actionType',
          element: <ProjectDetails />,
        },
      ],
    },
    {
      path: 'dashboard',
      children: [
        { element: <Navigate to="/cashier/dashboard/app" replace />, index: true },
        { path: 'app', element: <Main /> },
        { path: ':submiterId/:detailType', element: <ProjectOwnerDetails /> },
        {
          path: 'transaction-progression',
          children: [
            { path: '', element: <TransactionProgression /> },
            { path: 'add', element: <ListTrack /> },
            { path: 'edit/:id', element: <ListTrack /> },
            { path: 'review/:id', element: <ReviewOperationTrack /> },
          ],
        },
        {
          path: 'tracks-budget',
          children: [
            { path: '', element: <TracksBudget /> },
            {
              path: ':id/show',
              element: FEATURE_NESTED_TRACK_BUDGET ? <NewSectionTracks /> : <SectionTracks />,
            },
            {
              path: ':id/details',
              element: FEATURE_NESTED_TRACK_BUDGET && <ViewNewSectionTracks />,
            },
          ],
        },
        { path: 'gregorian-year', element: <GregorianYear /> },
        FEATURE_MENU_ADMIN_MOBILE_SETTINGS && {
          path: 'mobile-settings',
          children: [
            {
              path: '',
              element: <MobileSettings />,
            },
            // {
            //   path: ':id',
            //   element: <MobileSettingsForm />,
            // },
            // {
            //   path: 'add',
            //   element: <MobileSettingsForm />,
            // },
          ],
        },
        // { path: 'system-messages', element: <SystemMessages /> },
        {
          path: 'system-messages',
          children: [
            { path: '', element: <SystemMessages /> },
            {
              path: 'internal',
              children: [
                { path: '', element: <SystemMessagesInternalForm /> },
                { path: ':id', element: <SystemMessagesInternalForm /> },
              ],
            },
            {
              path: 'external',
              children: [
                { path: '', element: <SystemMessagesExternalForm /> },
                {
                  path: ':id',
                  element: <SystemMessagesExternalForm />,
                },
              ],
            },
          ],
        },
        { path: 'system-configuration', element: <SystemConfiguration /> },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },

            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
        {
          path: 'client-list',
          children: [
            {
              path: '',
              element: <CeoClientListPage />,
            },
            {
              path: 'owner/:submiterId',
              element: <ProjectOwnerDetails />,
            },
          ],
        },
        {
          path: 'users-and-permissions',
          children: [
            { path: '', element: <UsersAndPermissions /> },
            { path: 'add', element: <UsersAndPermissionsAdd /> },
            { path: 'edit/:userId', element: <UsersAndPermissionsEdit /> },
          ],
        },
        FEATURE_MENU_ADMIN_ADD_AUTHORITY && { path: 'authority', element: <Authority /> },
        FEATURE_MENU_ADMIN_ENTITY_AREA && { path: 'entity-area', element: <EntityArea /> },
        FEATURE_MENU_ADMIN_REGIONS && {
          path: 'regions-project-location',
          element: <RegionsProjectLocation />,
        },
        FEATURE_MENU_ADMIN_ENTITY_CLASSIFICATION && {
          path: 'entity-classification',
          element: <EntityClassification />,
        },
        { path: 'bank-name', element: <BankName /> },
        { path: 'beneficiaries', element: <Beneficiaries /> },
        MENU_ADMIN_PORTAL_REPORTS && { path: 'portal-reports', element: <PortalReports /> },
        { path: 'messages', element: <Messages /> },
        {
          path: 'old-proposal',
          element: <OldProposal />,
        },
        FEATURE_MENU_CLIENT_FILES && {
          path: 'client-files',
          element: <ClientFiles />,
        },
        FEATURE_CONTACT_US_BY_CLIENT && {
          path: 'contact-us',
          element: <ContactUs />,
        },
        FEATURE_MENU_ADMIN_APLICATION_ADMISSION && {
          path: 'application-and-admission-settings',
          element: <ApplicationAndAdmissionSettings />,
        },
      ],
    },
  ],
};
