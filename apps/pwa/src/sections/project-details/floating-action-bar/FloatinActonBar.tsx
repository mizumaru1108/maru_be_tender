import useAuth from 'hooks/useAuth';
import { useLocation, useParams } from 'react-router';
import ProjectManagerFloatingActionBar from './project-manager';
import SupervisorFloatingActionBar from './supervisor';
import CeoFloatingActionBar from './ceo';
import ModeratorActionBar from './moderator';
import { useSelector } from 'redux/store';
import ConsultantFloatingActionBar from './consultant';
import RejectProjectsActionBar from './reject-project';
import FloatingCloseReportSPV from '../floating-close-report/FloatingSpv';
import FloatingClientSubmit from '../floating-close-report/FloatingClientSubmit';

function FloatinActonBar() {
  const { actionType } = useParams();

  const location = useLocation();

  const { activeTap, proposal } = useSelector((state) => state.proposal);

  const { activeRole } = useAuth();

  const role = activeRole!;

  const pathName = location.pathname.split('/');

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

      {/* disabled other than accept reject button */}
      {activeTap &&
        actionType === 'reject-project' &&
        ['tender_ceo', 'tender_project_manager'].includes(role) && <RejectProjectsActionBar />}

      {activeTap &&
        ['main'].includes(activeTap) &&
        actionType === 'show-details' &&
        pathName &&
        pathName[3] === 'project-report' &&
        proposal.inner_status === 'DONE_BY_CASHIER' && <FloatingCloseReportSPV />}

      {activeTap &&
        ['follow-ups'].includes(activeTap) &&
        actionType === 'show-details' &&
        pathName &&
        pathName[3] === 'project-report' &&
        proposal.inner_status === 'REQUESTING_CLOSING_FORM' && <FloatingClientSubmit />}
    </>
  );
}

export default FloatinActonBar;
