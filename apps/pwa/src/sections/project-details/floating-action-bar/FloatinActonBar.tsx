import useAuth from 'hooks/useAuth';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import { useSelector } from 'redux/store';
import FloatingClientSubmit from '../floating-close-report/FloatingClientSubmit';
import FloatingCloseReportSPV from '../floating-close-report/FloatingSpv';
import CeoFloatingActionBar from './ceo';
import ConsultantFloatingActionBar from './consultant';
import ModeratorActionBar from './moderator';
import ProjectManagerFloatingActionBar from './project-manager';
import RejectProjectsActionBar from './reject-project';
import SupervisorFloatingActionBar from './supervisor';

//
import { getProposalClosingReport } from 'queries/client/getProposalClosingReport';
import FinanceFloatingActionBar from 'sections/project-details/floating-action-bar/finance';
import { useQuery } from 'urql';
import { FEATURE_AMANDEMENT_FROM_FINANCE } from '../../../config';
import PaymentAmandementFloatingActionBar from './supervisor/SendPaymentAmandement';
//

function FloatinActonBar() {
  const { actionType } = useParams();
  const location = useLocation();
  const { activeTap, proposal, loadingPayment } = useSelector((state) => state.proposal);
  const { isLoading } = useSelector((state) => state.tracks);
  const { activeRole } = useAuth();
  const role = activeRole!;
  const pathName = location.pathname.split('/');

  const [result] = useQuery({
    query: getProposalClosingReport,
    variables: {
      proposal_id: proposal.id,
    },
  });

  const { data } = result;

  return (
    <>
      {/* ’Moderator is done */}
      {loadingPayment || isLoading ? null : (
        <React.Fragment>
          {activeTap &&
            ['project-path', 'project-budget'].includes(activeTap) &&
            actionType === 'show-details' &&
            ['tender_moderator'].includes(role) &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' && <ModeratorActionBar />}
          {/* Supervisor is done */}
          {activeTap &&
            ['project-path', 'project-budget'].includes(activeTap) &&
            actionType === 'show-details' &&
            role === 'tender_project_supervisor' &&
            proposal.inner_status !== 'DONE_BY_CASHIER' &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' && (
              <SupervisorFloatingActionBar />
            )}
          {/* Projectmanager is done */}
          {activeTap &&
            ['project-path', 'project-budget'].includes(activeTap) &&
            actionType === 'show-details' &&
            role === 'tender_project_manager' &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' && (
              <ProjectManagerFloatingActionBar />
            )}
          {/* CEO is done */}
          {activeTap &&
            ['project-path', 'project-budget'].includes(activeTap) &&
            actionType === 'show-details' &&
            ['tender_ceo'].includes(role) &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' && <CeoFloatingActionBar />}
          {/* Consultant is done */}
          {activeTap &&
            ['project-path', 'supervisor-revision'].includes(activeTap) &&
            actionType === 'show-details' &&
            ['tender_consultant'].includes(role) &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' && (
              <ConsultantFloatingActionBar />
            )}

          {/* disabled other than accept reject button */}
          {activeTap &&
            actionType === 'reject-project' &&
            ['tender_ceo', 'tender_project_manager'].includes(role) &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' && (
              <RejectProjectsActionBar />
            )}

          {activeTap &&
            ['project-path'].includes(activeTap) &&
            (actionType === 'show-details' || actionType === 'show-project') &&
            pathName &&
            pathName[3] === 'project-report' &&
            proposal.inner_status === 'DONE_BY_CASHIER' &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' && <FloatingCloseReportSPV />}

          {activeTap &&
            ['follow-ups'].includes(activeTap) &&
            (actionType === 'show-details' || actionType === 'show-project') &&
            pathName &&
            (pathName[3] === 'project-report' || pathName[3] === 'current-project') &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' &&
            // (role === 'tender_project_supervisor' || role === 'tender_client') &&
            ['PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'].includes(proposal.inner_status) && (
              <FloatingClientSubmit />
            )}

          {!loadingPayment &&
            data &&
            (data.proposal_closing_report.length ? (
              <React.Fragment>
                {activeTap &&
                  ['follow-ups'].includes(activeTap) &&
                  ['show-details', 'show-project'].includes(actionType!) &&
                  pathName &&
                  pathName[3] === 'previous-funding-requests' &&
                  proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' &&
                  // (role === 'tender_project_supervisor' || role === 'tender_client') &&
                  ['PROJECT_COMPLETED'].includes(proposal.inner_status) && <FloatingClientSubmit />}
              </React.Fragment>
            ) : null)}

          {FEATURE_AMANDEMENT_FROM_FINANCE &&
            activeTap &&
            ['project-path', 'payments'].includes(activeTap) &&
            ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'].includes(proposal.inner_status) &&
            ['ONGOING'].includes(proposal.outter_status) &&
            ['tender_finance'].includes(role) &&
            ['show-details'].includes(actionType!) && <FinanceFloatingActionBar />}
          {FEATURE_AMANDEMENT_FROM_FINANCE &&
            activeTap &&
            ['project-path'].includes(activeTap) &&
            ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR', 'DONE_BY_CASHIER'].includes(
              proposal.inner_status
            ) &&
            proposal.outter_status === 'ASKED_FOR_AMANDEMENT_PAYMENT' &&
            ['tender_project_supervisor'].includes(role) && <PaymentAmandementFloatingActionBar />}
          {/* {activeTap &&
            ['project-path', 'payments'].includes(activeTap) &&
            ['tender_finance'].includes(role) && <FinanceFloatingActionBar />} */}
        </React.Fragment>
      )}
    </>
  );
}

export default FloatinActonBar;
