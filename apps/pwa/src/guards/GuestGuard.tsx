import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
// import { PATH_DASHBOARD } from '../routes/paths';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  console.log(user);
  // TODO map all the roles with their dashboard page
  // FOR testing now I will only redirect to the client dashboard page
  if (isAuthenticated) {
    return <Navigate to={'/client/dashboard/app'} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
