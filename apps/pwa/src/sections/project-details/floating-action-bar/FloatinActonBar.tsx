import React, { useEffect, useMemo, useState } from 'react';
import useAuth from 'hooks/useAuth';
import { useLocation, useParams } from 'react-router';
import ProjectManagerFloatingActionBar from './project-manager';
import SupervisorFloatingActionBar from './supervisor';
import CeoFloatingActionBar from './ceo';
import ModeratorActionBar from './moderator';
import { dispatch, useSelector } from 'redux/store';
import ConsultantFloatingActionBar from './consultant';
import RejectProjectsActionBar from './reject-project';
import FloatingCloseReportSPV from '../floating-close-report/FloatingSpv';
import FloatingClientSubmit from '../floating-close-report/FloatingClientSubmit';

//
import { useQuery } from 'urql';
import { getProposalClosingReport } from 'queries/client/getProposalClosingReport';
import FinanceFloatingActionBar from 'sections/project-details/floating-action-bar/finance';
import { FEATURE_AMANDEMENT_FROM_FINANCE } from '../../../config';
import PaymentAmandementFloatingActionBar from './supervisor/SendPaymentAmandement';
import { getTracks } from 'redux/slices/track';
import ProposalDisableModal from '../../../components/modal-dialog/ProposalDisableModal';
import useLocales from '../../../hooks/useLocales';
import ProposalNoBudgetRemainModal from '../../../components/modal-dialog/ProposalNoBudgetRemainModal';

//

function FloatinActonBar() {
  const { actionType } = useParams();
  const location = useLocation();
  const { translate } = useLocales();
  const { activeTap, proposal, loadingPayment } = useSelector((state) => state.proposal);
  const { track, isLoading } = useSelector((state) => state.tracks);
  const { activeRole } = useAuth();
  const role = activeRole!;
  const pathName = location.pathname.split('/');
  const [open, setOpen] = useState(false);
  console.log({ open });

  const isAvailBudget = useMemo(() => {
    let tmpIsAvail = false;
    if (track?.remaining_budget && track?.remaining_budget <= 0) {
      tmpIsAvail = false;
    } else {
      if (track?.budget && track?.budget > 0) {
        tmpIsAvail = true;
      } else {
        tmpIsAvail = false;
      }
    }
    return tmpIsAvail;
  }, [track]);

  useEffect(() => {
    if (isAvailBudget === false) {
      setOpen(true);
    }
  }, [isAvailBudget]);

  const handleCloseModal = () => {
    setOpen(false);
  };

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
      {loadingPayment || isLoading ? null : (
        <React.Fragment>
          <ProposalNoBudgetRemainModal
            open={open}
            message={`ميزانية المشروع تتخطى الميزانية المخصصة للمسار
            ${
              track?.remaining_budget && track?.remaining_budget <= 0 ? 0 : track?.remaining_budget
            } الميزانية المحددة للمشروع هي ${
              proposal?.fsupport_by_supervisor || proposal?.amount_required_fsupport || 0
            } ، الميزانية المتبقية في المسار هي `}
            handleClose={handleCloseModal}
          />
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
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' &&
            isAvailBudget && <SupervisorFloatingActionBar />}
          {/* Projectmanager is done */}
          {activeTap &&
            ['project-path', 'project-budget'].includes(activeTap) &&
            actionType === 'show-details' &&
            role === 'tender_project_manager' &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' &&
            isAvailBudget && <ProjectManagerFloatingActionBar />}
          {/* CEO is done */}
          {activeTap &&
            ['project-path', 'project-budget'].includes(activeTap) &&
            actionType === 'show-details' &&
            ['tender_ceo'].includes(role) &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' &&
            isAvailBudget && <CeoFloatingActionBar />}
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
            actionType === 'show-details' &&
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
                  (actionType === 'show-details' || actionType === 'show-project') &&
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
            ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR', 'DONE_BY_CASHIER'].includes(
              proposal.inner_status
            ) &&
            proposal.outter_status !== 'ASKED_FOR_AMANDEMENT_PAYMENT' &&
            proposal.outter_status !== 'ON_REVISION' &&
            ['tender_finance'].includes(role) && <FinanceFloatingActionBar />}
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
