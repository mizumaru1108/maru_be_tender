import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
// import { PATH_DASHBOARD } from '../routes/paths';
// components
import LoadingScreen from '../components/LoadingScreen';
import { FusionAuthRoles, role_url_map } from '../@types/commons';

// ----------------------------------------------------------------------
type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  const role = user?.registrations[0].roles[0] as FusionAuthRoles;
  console.log(role);
  if (isAuthenticated) {
    return <Navigate to={`/${role_url_map[`${role}`]}/dashboard/app`} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
