import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const Main = Loadable(lazy(() => import('pages/admin/MainPage')));
const TransactionProgression = Loadable(lazy(() => import('pages/admin/TransactionProgression')));
const TracksBudget = Loadable(lazy(() => import('pages/admin/TracksBudget')));
const GregorianYear = Loadable(lazy(() => import('pages/admin/GregorianYear')));
const ApplicationAndAdmissionSettings = Loadable(
  lazy(() => import('pages/admin/ApplicationAndAdmissionSettings'))
);
const MobileSettings = Loadable(lazy(() => import('pages/admin/MobileSettings')));
const SystemMessages = Loadable(lazy(() => import('pages/admin/SystemMessages')));
const SystemConfiguration = Loadable(lazy(() => import('pages/admin/SystemConfiguration')));
const UsersAndPermissions = Loadable(lazy(() => import('pages/admin/UsersAndPermissions')));
const Authority = Loadable(lazy(() => import('pages/admin/Authority')));
const EntityArea = Loadable(lazy(() => import('pages/admin/EntityArea')));
const RegionsProjectLocation = Loadable(lazy(() => import('pages/admin/RegionsProjectLocation')));
const EntityClassification = Loadable(lazy(() => import('pages/admin/EntityClassification')));
const BankName = Loadable(lazy(() => import('pages/admin/BankName')));
const Beneficiaries = Loadable(lazy(() => import('pages/admin/Beneficiaries')));

const PortalReports = Loadable(lazy(() => import('pages/admin/PortalReports')));
const Messages = Loadable(lazy(() => import('pages/admin/Messages')));
export const adminRoute = {
  path: 'admin',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_admin']} hasContent={true}>
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
        { path: 'app', element: <Main /> },
        { path: 'transaction-progression', element: <TransactionProgression /> },
        { path: 'tracks-budget', element: <TracksBudget /> },
        { path: 'gregorian-year', element: <GregorianYear /> },
        {
          path: 'application-and-admission-settings',
          element: <ApplicationAndAdmissionSettings />,
        },
        { path: 'mobile-settings', element: <MobileSettings /> },
        { path: 'system-messages', element: <SystemMessages /> },
        { path: 'system-configuration', element: <SystemConfiguration /> },
        { path: 'users-and-permissions', element: <UsersAndPermissions /> },
        { path: 'authority', element: <Authority /> },
        { path: 'entity-area', element: <EntityArea /> },
        { path: 'regions-project-location', element: <RegionsProjectLocation /> },
        { path: 'entity-classification', element: <EntityClassification /> },
        { path: 'bank-name', element: <BankName /> },
        { path: 'beneficiaries', element: <Beneficiaries /> },
        { path: 'portal-reports', element: <PortalReports /> },
        { path: 'messages', element: <Messages /> },
      ],
    },
  ],
};