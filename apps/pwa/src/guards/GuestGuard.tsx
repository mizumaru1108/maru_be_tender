import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
// import { PATH_DASHBOARD } from '../routes/paths';
// components
import LoadingScreen from '../components/LoadingScreen';
import { Role } from './RoleBasedGuard';

// ----------------------------------------------------------------------

const role_url_map = {
  cluster_admin: '',
  tender_accounts_manager: 'accounts-manager',
  tender_admin: '',
  tender_ceo: '',
  tender_cashier: '',
  tender_client: 'client',
  tender_consultant: '',
  tender_finance: '',
  tender_moderator: 'moderator',
  tender_project_manager: '',
  tender_project_supervisor: '',
};
type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  const role = user?.registrations[0].roles[0] as Role;
  // TODO map all the roles with their dashboard page
  // FOR testing now I will only redirect to the client dashboard page
  if (isAuthenticated) {
    return <Navigate to={`/${role_url_map[`${role}`]}/dashboard/app`} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
