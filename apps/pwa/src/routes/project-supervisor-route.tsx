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
const PortalReportsProjectSupervisor = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesProjectSupervisor = Loadable(lazy(() => import('pages/project-supervisor/Messages')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);
const AmandementRequest = Loadable(
  lazy(() => import('pages/amandement-request/AmandementRequest'))
);
const ProposalAmandementRequest = Loadable(
  lazy(() => import('pages/amandement-request/client/AmandementRequestProposal'))
);

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));

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
        { element: <Navigate to="/project-supervisor/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainProjectSupervisor /> },
        { path: 'amandment-request/:id', element: <AmandementRequest /> },
        { path: 'proposal-amandment-request/:proposal_id', element: <ProposalAmandementRequest /> },
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
            { path: '', element: <IncomingFundingRequestsProjectSupervisor /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <RequestsInProcessProjectSupervisor /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviousFundingRequestsProjectSupervisor /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'payment-adjustment',
          children: [
            { path: '', element: <PaymentAdjustmenProjectSupervisor /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        { path: 'portal-reports', element: <PortalReportsProjectSupervisor /> },
        { path: 'messages', element: <MessagesProjectSupervisor /> },
      ],
    },
  ],
};
