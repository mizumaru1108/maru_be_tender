import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainConsultant = Loadable(lazy(() => import('pages/consultant/MainPage')));
const IncomingFundingRequestConsultant = Loadable(
  lazy(() => import('pages/consultant/IncomingFundingRequests'))
);
const PortalReportsConsultant = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesConsultant = Loadable(lazy(() => import('pages/consultant/Messages')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));

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
      path: 'dashboard',
      children: [
        { element: <Navigate to="/consultant/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainConsultant /> },
        {
          path: 'incoming-funding-requests',
          children: [
            { path: '', element: <IncomingFundingRequestConsultant /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'project-timeline', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'supervisor-revision', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        {
          path: 'portal-reports',
          children: [{ path: '', element: <PortalReportsConsultant /> }],
        },
        { path: 'messages', element: <MessagesConsultant /> },
      ],
    },
  ],
};
