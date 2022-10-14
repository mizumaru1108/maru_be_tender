import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import CheakClientActivation from 'guards/CheakClientActivation';
import { Loadable } from './Loadable';

const FundingProjectRequest = Loadable(lazy(() => import('pages/client/FundingProjectRequest')));
const DraftFundingRequests = Loadable(lazy(() => import('pages/client/draft-funding-requests')));
const PreviousFundingRequests = Loadable(
  lazy(() => import('pages/client/previous-funding-requests'))
);
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const Messages = Loadable(lazy(() => import('pages/client/Messages')));
const ContactSupport = Loadable(lazy(() => import('pages/client/ContactSupport')));
const MainClientPage = Loadable(lazy(() => import('pages/client/MainClientPage')));
const ClientProfile = Loadable(lazy(() => import('pages/client/ClientProfile')));
const ClientProfileEdit = Loadable(lazy(() => import('pages/client/ClientProfileEdit')));
const Searching = Loadable(lazy(() => import('pages/searching')));
export const clientRoute = {
  path: 'client',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_client']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/client/dashboard/app" replace />, index: true },
    {
      path: 'my-profile',
      children: [
        { path: '', element: <ClientProfile /> },
        { path: 'edit', element: <ClientProfileEdit /> },
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
        { element: <Navigate to="/client/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainClientPage /> },
        {
          path: 'funding-project-request',
          element: (
            <CheakClientActivation>
              <FundingProjectRequest />,
            </CheakClientActivation>
          ),
        },
        {
          path: 'draft-funding-requests',
          children: [
            {
              path: '',
              element: (
                <CheakClientActivation>
                  <DraftFundingRequests />
                </CheakClientActivation>
              ),
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          element: (
            <CheakClientActivation>
              <PreviousFundingRequests />,
            </CheakClientActivation>
          ),
          children: [
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'payments', element: <ProjectDetails /> },
              ],
            },
          ],
        },
        { path: 'messages', element: <Messages /> },
        {
          path: 'contact-support',
          element: <ContactSupport />,
        },
        {
          path: 'current-project',
          element: (
            <CheakClientActivation>
              <PreviousFundingRequests />,
            </CheakClientActivation>
          ),
          children: [
            {
              path: ':id/:actionType',
              children: [
                { path: 'main', element: <ProjectDetails /> },
                { path: 'project-budget', element: <ProjectDetails /> },
                { path: 'follow-ups', element: <ProjectDetails /> },
                { path: 'payments', element: <ProjectDetails /> },
              ],
            },
          ],
        },
      ],
    },
  ],
};
