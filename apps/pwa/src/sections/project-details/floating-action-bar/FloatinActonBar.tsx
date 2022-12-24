import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router';
import ProjectManagerFloatingActionBar from './project-manager';
import SupervisorFloatingActionBar from './supervisor';
import CeoFloatingActionBar from './ceo';
import ModeratorActionBar from './moderator';
import { useSelector } from 'redux/store';
import ConsultantFloatingActionBar from './consultant';

function FloatinActonBar() {
  const { actionType } = useParams();

  const { activeTap } = useSelector((state) => state.proposal);

  const { activeRole } = useAuth();

  const role = activeRole!;

  return (
    <>
      {/* ’Moderator is done */}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        ['tender_moderator'].includes(role) && <ModeratorActionBar />}
      {/* Supervisor is done */}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        role === 'tender_project_supervisor' && <SupervisorFloatingActionBar />}
      {/* Projectmanager is done */}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        role === 'tender_project_manager' && <ProjectManagerFloatingActionBar />}
      {/* CEO is done */}
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' &&
        ['tender_ceo'].includes(role) && <CeoFloatingActionBar />}
      {/* Consultant is done */}
      {activeTap &&
        ['main', 'supervisor-revision'].includes(activeTap) &&
        actionType === 'show-details' &&
        ['tender_consultant'].includes(role) && <ConsultantFloatingActionBar />}
    </>
  );
}

export default FloatinActonBar;
