import { lazy } from 'react';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainManagerPage = Loadable(lazy(() => import('pages/accounts-manager/MainManagerPage')));
const NewJoinRequestPage = Loadable(lazy(() => import('pages/accounts-manager/new/join-request')));
const InfoUpdateRequestPage = Loadable(
  lazy(() => import('pages/accounts-manager/info/update-request'))
);
const PartnerManagementPage = Loadable(
  lazy(() => import('pages/accounts-manager/partner/management'))
);
const PortalReportsPage = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesManagerPage = Loadable(lazy(() => import('pages/accounts-manager/Messages')));
const PartnerDetailsPage = Loadable(
  lazy(() => import('pages/accounts-manager/partner/PartnerDetails'))
);
const EditRequestDetailsPage = Loadable(
  lazy(() => import('pages/accounts-manager/partner/EditRequestDetails'))
);
const PartnerSendAmandementPage = Loadable(
  lazy(() => import('pages/accounts-manager/partner/SendAmandementRequest'))
);

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);

const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));

const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));

const ProjectPreview = Loadable(lazy(() => import('pages/ProposalPrintPreview')));

export const accoutsManagerRoute = {
  path: 'accounts-manager',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_accounts_manager']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    {
      path: 'dashboard',
      children: [
        { path: 'app', element: <MainManagerPage /> },
        { path: ':submiterId/:detailType', element: <ProjectOwnerDetails /> },
        { path: 'new/join-request', element: <NewJoinRequestPage /> },
        { path: 'info/update-request', element: <InfoUpdateRequestPage /> },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },
            { path: 'preview/:id', element: <ProjectPreview /> },
            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
        {
          path: 'partner',
          children: [
            { path: 'management', element: <PartnerManagementPage /> },
            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
            {
              path: ':partnerId',
              element: <PartnerDetailsPage />,
            },
            {
              path: ':requestId/:editStatus',
              element: <EditRequestDetailsPage />,
            },
            { path: ':partnerId/amendment-request', element: <PartnerSendAmandementPage /> },
          ],
        },
        { path: 'portal-reports', element: <PortalReportsPage /> },
        { path: 'messages', element: <MessagesManagerPage /> },
      ],
    },
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
  ],
};
