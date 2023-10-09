import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';
import { FEATURE_MENU_CLIENT_FILES, FEATURE_SEND_EMAIL_TO_CLIENT } from 'config';

const MainProjectSupervisor = Loadable(lazy(() => import('pages/project-supervisor/MainPage')));
const IncomingFundingRequestsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/IncomingFundingRequests'))
);
const IncomingCloseReports = Loadable(
  lazy(() => import('pages/project-supervisor/IncomingCloseReports'))
);
const ProjectReportFinished = Loadable(lazy(() => import('pages/client/ProjectReportFinished')));
const RequestsInProcessProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/RequestsInProcess'))
);
const PreviousFundingRequestsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PreviousFundingRequests'))
);
const PaymentAdjustmenProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PaymentAdjustment'))
);
const IncomingAmandementProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/IncomingAmandementRequest'))
);
const OldProposal = Loadable(lazy(() => import('pages/project-supervisor/OldProposal')));
const ClientFiles = Loadable(lazy(() => import('pages/client-files/ClientFiles')));
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
const AppointmentsWithPartners = Loadable(
  lazy(() => import('pages/project-supervisor/AppointmentsWithPartners'))
);
const BookingAMeeting = Loadable(lazy(() => import('pages/project-supervisor/BookingAMeeting')));

const ClientListPage = Loadable(lazy(() => import('pages/project-supervisor/ClientListPage')));
const PreviewPayment = Loadable(lazy(() => import('sections/finance/payment/PreviewPayment')));
const ProjectPreview = Loadable(lazy(() => import('pages/ProposalPrintPreview')));
const EmailToClient = Loadable(lazy(() => import('pages/project-supervisor/EmailToClient')));
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
          path: 'generate/:id/payments/:paymentId',
          element: <PreviewPayment />,
        },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },
            { path: 'preview/:id', element: <ProjectPreview /> },
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
          path: 'project-report',
          children: [
            { path: '', element: <IncomingCloseReports /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
            {
              path: ':id/:actionType/finished',
              element: <ProjectReportFinished />,
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
        {
          path: 'incoming-amandment-requests',
          children: [
            { path: '', element: <IncomingAmandementProjectSupervisor /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        { path: 'portal-reports', element: <PortalReportsProjectSupervisor /> },
        { path: 'messages', element: <MessagesProjectSupervisor /> },
        {
          path: 'appointments-with-partners',
          children: [
            { path: '', element: <AppointmentsWithPartners /> },
            { path: 'booking', element: <BookingAMeeting /> },
          ],
        },
        {
          path: 'old-proposal',
          element: <OldProposal />,
        },
        FEATURE_MENU_CLIENT_FILES && {
          path: 'client-files',
          element: <ClientFiles />,
        },
        {
          path: 'client-list',
          children: [
            {
              path: '',
              element: <ClientListPage />,
            },
            {
              path: 'owner/:submiterId',
              element: <ProjectOwnerDetails />,
            },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        FEATURE_SEND_EMAIL_TO_CLIENT && {
          path: 'send-email',
          element: <EmailToClient />,
        },
      ],
    },
  ],
};
