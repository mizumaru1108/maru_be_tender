import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainProjectSupervisor = Loadable(lazy(() => import('pages/project-supervisor/MainPage')));
const IncomingFundingRequestsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/IncomingFundingRequests'))
);
const RequestsInProcessProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/RequestsInProcess'))
);
const PreviousFundingRequestsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PreviousFundingRequests'))
);
const PaymentAdjustmenProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PaymentAdjustment'))
);
const PortalReportsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PortalReports'))
);
const MessagesProjectSupervisor = Loadable(lazy(() => import('pages/project-supervisor/Messages')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));

export const projectSupervisorRoute = {
  path: 'project-supervisor',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_project_supervisor']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/project-supervisor/dashboard/app" replace />, index: true },
    {
      path: 'dashboard',
      children: [
        { element: <Navigate to="/project-supervisor/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainProjectSupervisor /> },
        {
          path: 'incoming-funding-requests',
          children: [
            { path: '', element: <IncomingFundingRequestsProjectSupervisor /> },
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
            { path: '', element: <RequestsInProcessProjectSupervisor /> },
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
            { path: '', element: <PreviousFundingRequestsProjectSupervisor /> },
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
          path: 'payment-adjustment',
          children: [
            { path: '', element: <PaymentAdjustmenProjectSupervisor /> },
            {
              path: ':id/:actionType',
              children: [
                { path: '', element: <PaymentAdjustmenProjectSupervisor /> },
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
        { path: 'portal-reports', element: <PortalReportsProjectSupervisor /> },
        { path: 'messages', element: <MessagesProjectSupervisor /> },
      ],
    },
  ],
};