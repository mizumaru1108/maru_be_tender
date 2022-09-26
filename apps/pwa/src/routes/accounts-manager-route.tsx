import { lazy } from 'react';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainManagerPage = Loadable(lazy(() => import('pages/accounts-manager/MainManagerPage')));
const NewJoinRequestPage = Loadable(lazy(() => import('pages/accounts-manager/new/join-request')));
const InfoUpdateRequestPage = Loadable(
  lazy(() => import('pages/accounts-manager/info/update-request'))
);
const PartnerManagementPage = Loadable(
  lazy(() => import('pages/accounts-manager/partner/management'))
);
const PortalReportsPage = Loadable(lazy(() => import('pages/accounts-manager/PortalReportsPage')));
const MessagesManagerPage = Loadable(lazy(() => import('pages/accounts-manager/Messages')));

export const accoutsManagerRoute = {
  path: 'accounts-manager',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_accounts_manager']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    {
      path: 'dashboard',
      children: [
        { path: 'app', element: <MainManagerPage /> },
        { path: 'new/join-request', element: <NewJoinRequestPage /> },
        { path: 'info/update-request', element: <InfoUpdateRequestPage /> },
        { path: 'partner/management', element: <PartnerManagementPage /> },
        { path: 'portal-reports', element: <PortalReportsPage /> },
        { path: 'messages', element: <MessagesManagerPage /> },
      ],
    },
  ],
};
