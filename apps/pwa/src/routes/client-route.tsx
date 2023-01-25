import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const FundingProjectRequest = Loadable(lazy(() => import('pages/client/FundingProjectRequest')));
const DraftFundingRequests = Loadable(lazy(() => import('pages/client/draft-funding-requests')));
const PreviousFundingRequests = Loadable(
  lazy(() => import('pages/client/previous-funding-requests'))
);
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);
const Messages = Loadable(lazy(() => import('pages/client/Messages')));
const ContactSupport = Loadable(lazy(() => import('pages/client/ContactSupport')));
const MainClientPage = Loadable(lazy(() => import('pages/client/MainClientPage')));
const ClientProfile = Loadable(lazy(() => import('pages/client/ClientProfile')));
const ClientProfileEdit = Loadable(lazy(() => import('pages/client/ClientProfileEdit')));
const ClientUserEdit = Loadable(lazy(() => import('pages/client/ClientUserEdit')));
const Searching = Loadable(lazy(() => import('pages/searching')));
const Appointments = Loadable(lazy(() => import('pages/client/Appointments')));
const AdjustYourTime = Loadable(lazy(() => import('pages/client/AdjustYourTime')));
export const clientRoute = {
  path: 'client',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_client']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/client/dashboard/app" replace />, index: true },
    {
      path: 'my-profile',
      children: [
        { path: '', element: <ClientProfile /> },
        { path: 'edit', element: <ClientProfileEdit /> },
        { path: 'edit-user', element: <ClientUserEdit /> },
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
        { element: <Navigate to="/client/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainClientPage /> },
        {
          path: 'funding-project-request',
          element: <FundingProjectRequest />,
        },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },

            { path: ':id/owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
        {
          path: 'draft-funding-requests',
          children: [
            {
              path: '',
              element: <DraftFundingRequests />,
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviousFundingRequests /> },
            { path: ':id/:actionType', element: <ProjectDetails /> },
          ],
        },

        {
          path: 'current-project',
          element: <PreviousFundingRequests />,
        },
        {
          path: 'current-project/:id/:actionType',
          element: <ProjectDetails />,
        },
        { path: 'messages', element: <Messages /> },
        {
          path: 'contact-support',
          element: <ContactSupport />,
        },
        {
          path: 'appointments',
          children: [
            { path: '', element: <Appointments /> },
            { path: 'adjust-your-time', element: <AdjustYourTime /> },
          ],
        },
      ],
    },
  ],
};
