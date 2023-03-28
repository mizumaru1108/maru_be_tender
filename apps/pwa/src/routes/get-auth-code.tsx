import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const GetAuth = Loadable(lazy(() => import('pages/project-supervisor/GetAuthCode')));

export const getAuthCode = {
  path: 'tender-appointment/google-callback',
  element: (
    <AuthGuard>
      <GetAuth />
    </AuthGuard>
  ),
  // children: [
  //   { element: <Navigate to="/project-supervisor/dashboard/app" replace />, index: true },
  //   {
  //     path: 'my-profile',
  //     children: [
  //       { path: '', element: <NonClientProfile /> },
  //       { path: 'edit', element: <NonClientProfileEdit /> },
  //     ],
  //   },
  //   {
  //     path: 'searching',
  //     children: [
  //       { path: '', element: <Searching /> },
  //       {
  //         path: ':id/:actionType',
  //         element: <ProjectDetails />,
  //       },
  //     ],
  //   },
  //   { path: 'tender-appointment/google-callback', element: <GetAuth /> },
  //   {
  //     path: 'dashboard',
  //     children: [
  //       { element: <Navigate to="/project-supervisor/dashboard/app" replace />, index: true },
  //       { path: 'app', element: <MainProjectSupervisor /> },
  //       { path: 'amandment-request/:id', element: <AmandementRequest /> },
  //       { path: 'proposal-amandment-request/:proposal_id', element: <ProposalAmandementRequest /> },
  //       { path: ':submiterId/:detailType', element: <ProjectOwnerDetails /> },
  //       {
  //         path: 'current-project',
  //         children: [
  //           { path: ':id/:actionType', element: <ProjectDetails /> },

  //           { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
  //         ],
  //       },
  //       {
  //         path: 'incoming-funding-requests',
  //         children: [
  //           { path: '', element: <IncomingFundingRequestsProjectSupervisor /> },
  //           {
  //             path: ':id/:actionType',
  //             element: <ProjectDetails />,
  //           },
  //         ],
  //       },
  //       {
  //         path: 'project-report',
  //         children: [
  //           { path: '', element: <IncomingCloseReports /> },
  //           {
  //             path: ':id/:actionType',
  //             element: <ProjectDetails />,
  //           },
  //           {
  //             path: ':id/:actionType/finished',
  //             element: <ProjectReportFinished />,
  //           },
  //         ],
  //       },
  //       {
  //         path: 'requests-in-process',
  //         children: [
  //           { path: '', element: <RequestsInProcessProjectSupervisor /> },
  //           {
  //             path: ':id/:actionType',
  //             element: <ProjectDetails />,
  //           },
  //         ],
  //       },
  //       {
  //         path: 'previous-funding-requests',
  //         children: [
  //           { path: '', element: <PreviousFundingRequestsProjectSupervisor /> },
  //           {
  //             path: ':id/:actionType',
  //             element: <ProjectDetails />,
  //           },
  //         ],
  //       },
  //       {
  //         path: 'payment-adjustment',
  //         children: [
  //           { path: '', element: <PaymentAdjustmenProjectSupervisor /> },
  //           {
  //             path: ':id/:actionType',
  //             element: <ProjectDetails />,
  //           },
  //         ],
  //       },
  //       { path: 'portal-reports', element: <PortalReportsProjectSupervisor /> },
  //       { path: 'messages', element: <MessagesProjectSupervisor /> },
  //       {
  //         path: 'appointments-with-partners',
  //         children: [
  //           { path: '', element: <AppointmentsWithPartners /> },
  //           { path: 'booking', element: <BookingAMeeting /> },
  //         ],
  //       },
  //     ],
  //   },
  // ],
};
