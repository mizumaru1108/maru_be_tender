import useAuth from 'hooks/useAuth';
import { useLocation, useParams } from 'react-router';
import { SupervisorFloatingActionBar } from './supervisor';
import { Role } from 'guards/RoleBasedGuard';
import { ProjectManagerFloatingActionBar } from './project-manager';
import { ModeratoeCeoFloatingActionBar } from './moderator-ceo';
import { ModeratorFloatingActionBar } from './moderator';

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
        role === 'tender_project_supervisor' && (
          <SupervisorFloatingActionBar organizationId={proposalData.user.id} data={proposalData} />
        )}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        role === 'tender_project_manager' && (
          <ProjectManagerFloatingActionBar organizationId={proposalData.user.id} />
        )}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        ['tender_ceo'].includes(role) && <ModeratoeCeoFloatingActionBar />}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        ['tender_moderator'].includes(role) && <ModeratorFloatingActionBar />}
    </>
  );
}

export default FloatinActonBar;
