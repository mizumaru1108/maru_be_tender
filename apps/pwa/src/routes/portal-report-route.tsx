import { lazy } from 'react';
import { Navigate } from 'react-router';
// guards
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
// layout
import DashboardLayout from 'layouts/dashboard';
// component
import { Loadable } from './Loadable';
//
const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const PortalReportsPage = Loadable(lazy(() => import('pages/PortalReports')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);
const ProjectPreview = Loadable(lazy(() => import('pages/ProposalPrintPreview')));

export const portalReportRoute = {
  path: 'portal-report',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_portal_report']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/portal-report/dashboard/app" replace />, index: true },
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
        { element: <Navigate to="/auditor-report/dashboard/app" replace />, index: true },
        { path: 'app', element: <PortalReportsPage /> },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PortalReportsPage /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },
            { path: 'preview/:id', element: <ProjectPreview /> },
            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
      ],
    },
  ],
};
