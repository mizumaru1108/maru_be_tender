import React from 'react';
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

//
import { useQuery } from 'urql';
import { getProposalClosingReport } from 'queries/client/getProposalClosingReport';

//

function FloatinActonBar() {
  const { actionType } = useParams();

  const location = useLocation();

  const { activeTap, proposal } = useSelector((state) => state.proposal);

  const { activeRole } = useAuth();

  const role = activeRole!;

  const pathName = location.pathname.split('/');

  const [result] = useQuery({
    query: getProposalClosingReport,
    variables: {
      proposal_id: proposal.id,
    },
  });

  const { data, fetching, error: errorGetProposal } = result;

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
        role === 'tender_project_supervisor' &&
        proposal.inner_status !== 'DONE_BY_CASHIER' && <SupervisorFloatingActionBar />}
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
        (actionType === 'show-details' || actionType === 'show-project') &&
        pathName &&
        pathName[3] === 'project-report' &&
        (role === 'tender_project_supervisor' || role === 'tender_client') &&
        ['PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'].includes(proposal.inner_status) && (
          <FloatingClientSubmit />
        )}

      {!fetching &&
        data &&
        (data.proposal_closing_report.length ? (
          <React.Fragment>
            {activeTap &&
              ['follow-ups'].includes(activeTap) &&
              (actionType === 'show-details' || actionType === 'show-project') &&
              pathName &&
              pathName[3] === 'previous-funding-requests' &&
              (role === 'tender_project_supervisor' || role === 'tender_client') &&
              ['PROJECT_COMPLETED'].includes(proposal.inner_status) && <FloatingClientSubmit />}
          </React.Fragment>
        ) : null)}
    </>
  );
}

export default FloatinActonBar;
