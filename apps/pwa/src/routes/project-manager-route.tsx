import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainProjectManager = Loadable(lazy(() => import('pages/project-manager/MainPage')));
const IncomingFundingRequestsProjectManager = Loadable(
  lazy(() => import('pages/project-manager/IncomingFundingRequests'))
);
const RequestsInProcessProjectManager = Loadable(
  lazy(() => import('pages/project-manager/RequestsInProcess'))
);
const PreviousFundingRequestsProjectManager = Loadable(
  lazy(() => import('pages/project-manager/PreviousFundingRequests'))
);
const PortalReportsProjectManager = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesProjectManager = Loadable(lazy(() => import('pages/project-manager/Messages')));
const ExchangePermissionProjectManager = Loadable(
  lazy(() => import('pages/project-manager/ExchangePermission'))
);
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const AppointmentsWithPartners = Loadable(
  lazy(() => import('pages/project-manager/AppointmentsWithPartners'))
);

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);

export const projectManagerRoute = {
  path: 'project-manager',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_project_manager']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/project-manager/dashboard/app" replace />, index: true },
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
        { element: <Navigate to="/project-manager/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainProjectManager /> },
        {
          path: 'incoming-funding-requests',
          children: [
            { path: '', element: <IncomingFundingRequestsProjectManager /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'project-timeline', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <RequestsInProcessProjectManager /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'project-timeline', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviousFundingRequestsProjectManager /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'project-timeline', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        {
          path: 'exchange-permission',
          children: [
            { path: '', element: <ExchangePermissionProjectManager /> },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'project-timeline', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'payments', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        { path: 'portal-reports', element: <PortalReportsProjectManager /> },
        { path: 'messages', element: <MessagesProjectManager /> },
        { path: 'appointments-with-partners', element: <AppointmentsWithPartners /> },
      ],
    },
  ],
};
