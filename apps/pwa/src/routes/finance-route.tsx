import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainFinance = Loadable(lazy(() => import('pages/finance/MainPage')));
const IncomingExchangePermissionRequestsFinance = Loadable(
  lazy(() => import('pages/finance/IncomingExchangePermissionRequests'))
);
const RequestsInProcessFinance = Loadable(lazy(() => import('pages/finance/RequestsInProcess')));
const PortalReportsFinance = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesFinance = Loadable(lazy(() => import('pages/finance/Messages')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const AmandementRequest = Loadable(
  lazy(() => import('pages/amandement-request/AmandementRequest'))
);

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));

export const financeRoute = {
  path: 'finance',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_finance']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/finance/dashboard/app" replace />, index: true },
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
        { element: <Navigate to="/finance/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainFinance /> },
        {
          path: 'incoming-exchange-permission-requests',
          children: [
            { path: '', element: <IncomingExchangePermissionRequestsFinance /> },
            {
              path: ':id/amandementRequest',
              element: <AmandementRequest />,
            },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'project-timeline', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'payments', element: <ProjectDetails /> },
                { path: 'exchange-details', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <RequestsInProcessFinance /> },
            {
              path: ':id/amandementRequest',
              element: <AmandementRequest />,
            },
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'project-path', element: <ProjectDetails /> },
                { path: 'project-timeline', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'payments', element: <ProjectDetails /> },
                { path: 'exchange-details', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        { path: 'portal-reports', element: <PortalReportsFinance /> },
        { path: 'messages', element: <MessagesFinance /> },
      ],
    },
  ],
};
