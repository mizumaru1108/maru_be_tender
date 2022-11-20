import useAuth from 'hooks/useAuth';
import { useLocation, useParams } from 'react-router';
import { SupervisorFloatingActionBar } from './supervisor';

import { ProjectManagerFloatingActionBar } from './project-manager';
import { ModeratorFloatingActionBar } from './moderator';
import { FusionAuthRoles } from '../../../@types/commons';
import { CeoFloatingActionBar } from './ceo';
import { ConsultantFloatingActionBar } from './consultant';

function FloatinActonBar({ proposalData }: any) {
  const { actionType } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.registrations[0].roles[0] as FusionAuthRoles;
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
        ['tender_ceo'].includes(role) &&
        proposalData.outter_status !== 'CANCELED' && (
          <CeoFloatingActionBar organizationId={proposalData.user.id} />
        )}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        ['tender_moderator'].includes(role) && <ModeratorFloatingActionBar />}
      {activeTap &&
        ['main', 'supervisor-revision'].includes(activeTap) &&
        actionType === 'show-details' &&
        ['tender_consultant'].includes(role) && <ConsultantFloatingActionBar />}
    </>
  );
}

export default FloatinActonBar;
