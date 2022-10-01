import useAuth from 'hooks/useAuth';
import { useLocation, useParams } from 'react-router';
import { SupervisorFloatingActionBar } from './supervisor';
import { Role } from 'guards/RoleBasedGuard';
import { ProjectManagerFloatingActionBar } from './project-manager';

function FloatinActonBar({ proposalData }: any) {
  const { actionType } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.registrations[0].roles[0] as Role;
  const activeTap = location.pathname.split('/').at(-1);

  return (
    <>
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        role === 'tender_project_supervisor' && <SupervisorFloatingActionBar />}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        role === 'tender_project_manager' && (
          <ProjectManagerFloatingActionBar organizationId={proposalData.user.id} />
        )}
    </>
  );
}

export default FloatinActonBar;
