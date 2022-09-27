import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainCashier = Loadable(lazy(() => import('pages/cashier/MainPage')));
const IncomingExchangePermissionRequestsCashier = Loadable(
  lazy(() => import('pages/cashier/IncomingExchangePermissionRequests'))
);
const RequestsInProcessCashier = Loadable(lazy(() => import('pages/cashier/RequestsInProcess')));
const PortalReportsCashier = Loadable(lazy(() => import('pages/cashier/PortalReports')));
const MessagesCashier = Loadable(lazy(() => import('pages/cashier/Messages')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));

export const cashierRoute = {
  path: 'cashier',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_cashier']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/cashier/dashboard/app" replace />, index: true },
    {
      path: 'dashboard',
      children: [
        { element: <Navigate to="/cashier/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainCashier /> },
        {
          path: 'incoming-exchange-permission-requests',
          children: [
            { path: '', element: <IncomingExchangePermissionRequestsCashier /> },
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
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <RequestsInProcessCashier /> },
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
        { path: 'portal-reports', element: <PortalReportsCashier /> },
        { path: 'messages', element: <MessagesCashier /> },
      ],
    },
  ],
};
