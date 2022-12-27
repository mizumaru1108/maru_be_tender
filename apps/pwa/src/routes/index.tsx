import { Navigate, useRoutes } from 'react-router-dom';
import { clientRoute } from './client-route';
import { consultantRoute } from './consultant-route';
import { moderatorRoute } from './moderator-route';
import { financeRoute } from './finance-route';
import { projectSupervisorRoute } from './project-supervisor-route';
import { projectManagerRoute } from './project-manager-route';
import { cashierRoute } from './cashier-route';
import { authRoute } from './auth-route';
import { accoutsManagerRoute } from './accounts-manager-route';
import { ceoRoute } from './ceo-route';
import { mainRoute } from './main-route';
import { adminRoute } from './admin-route';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    authRoute,
    clientRoute,
    moderatorRoute,
    consultantRoute,
    accoutsManagerRoute,
    financeRoute,
    cashierRoute,
    projectSupervisorRoute,
    projectManagerRoute,
    ceoRoute,
    mainRoute,
    adminRoute,
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />,
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
