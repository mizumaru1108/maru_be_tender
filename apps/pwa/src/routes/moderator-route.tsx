import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainModeratorPage = Loadable(lazy(() => import('pages/moderator/MainModeratorPage')));
const ModeratorProfile = Loadable(lazy(() => import('pages/moderator/ModeratorProfile')));
// const ModeratorProfileEdit = Loadable(lazy(() => import('pages/moderator/ModeratorProfileEdit')));
const ModeratorMessages = Loadable(lazy(() => import('pages/moderator/ModeratorMessages')));
const IncomingSupportRequests = Loadable(
  lazy(() => import('pages/moderator/incoming-support-requests'))
);
const PreviouseSupportRequests = Loadable(
  lazy(() => import('pages/moderator/previous-support-requests'))
);
const PortalReports = Loadable(lazy(() => import('pages/PortalReports')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);

export const moderatorRoute = {
  path: 'moderator',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_moderator']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/moderator/dashboard/app" replace />, index: true },
    {
      path: 'my-profile',
      children: [
        { path: '', element: <NonClientProfile /> },
        { path: 'edit', element: <NonClientProfileEdit /> },
      ],
    },
    {
      path: 'dashboard',
      children: [
        { element: <Navigate to="/moderator/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainModeratorPage /> },
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <IncomingSupportRequests /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'payments', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        {
          path: 'incoming-support-requests',
          // element: <IncomingSupportRequests />,
          children: [
            { path: '', element: <IncomingSupportRequests /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviouseSupportRequests /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'payments', element: <ProjectDetails /> },
              ],
            },
          ],
        },

        // { path: 'previous-support-requests', element: <PreviouseSupportRequests /> },
        { path: 'portal-reports', element: <PortalReports /> },
        { path: 'messages', element: <ModeratorMessages /> },
      ],
    },
  ],
};
