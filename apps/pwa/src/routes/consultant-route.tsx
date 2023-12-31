import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';
import { FEATURE_MENU_CLIENT_FILES } from 'config';

const MainConsultant = Loadable(lazy(() => import('pages/consultant/MainPage')));
const IncomingFundingRequestConsultant = Loadable(
  lazy(() => import('pages/consultant/IncomingFundingRequests'))
);
const PortalReportsConsultant = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesConsultant = Loadable(lazy(() => import('pages/consultant/Messages')));
const OldProposal = Loadable(lazy(() => import('pages/consultant/OldProposal')));
const ClientFiles = Loadable(lazy(() => import('pages/client-files/ClientFiles')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));
const AmandementRequest = Loadable(
  lazy(() => import('pages/amandement-request/AmandementRequest'))
);

export const consultantRoute = {
  path: 'consultant',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_consultant']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/consultant/dashboard/app" replace />, index: true },
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
        { element: <Navigate to="/consultant/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainConsultant /> },
        { path: 'amandment-request/:id', element: <AmandementRequest /> },
        { path: ':submiterId/:detailType', element: <ProjectOwnerDetails /> },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },

            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
        {
          path: 'incoming-funding-requests',
          children: [
            { path: '', element: <IncomingFundingRequestConsultant /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'portal-reports',
          children: [{ path: '', element: <PortalReportsConsultant /> }],
        },
        { path: 'messages', element: <MessagesConsultant /> },
        {
          path: 'old-proposal',
          element: <OldProposal />,
        },
        FEATURE_MENU_CLIENT_FILES && {
          path: 'client-files',
          element: <ClientFiles />,
        },
      ],
    },
  ],
};
