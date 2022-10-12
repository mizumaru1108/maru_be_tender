import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import ModalDialog from 'components/modal-dialog';

import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { approveProposal } from 'queries/commons/approveProposal';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useMutation } from 'urql';
import {
  AppRole,
  HashuraRoles,
  InnerStatus,
  role_url_map,
  updateProposalStatusAndState,
} from '../../../../@types/commons';
import { approveProposalWLog } from '../../../../queries/commons/approveProposalWithLog';
import { rejectProposalWLog } from '../../../../queries/commons/rejectProposalWithLog';
import ApproveModal from './ApproveModal';
import FormActionBox from './FormActionBox';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import {
  ceoAndModeratorProposalLogPayload,
  ModeratoeCeoFloatingActionBarProps,
  ProposalRejectPayload,
} from './types';

function FloatingActionBar({ organizationId }: ModeratoeCeoFloatingActionBarProps) {
  const { user } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const { translate } = useLocales();
  const [modalState, setModalState] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Logic here to get current user role
  const currentRoles = user?.registrations[0].roles[0] as HashuraRoles; // from db
  const userId = user?.id;

  // var for insert into navigate in handel Approval and Rejected
  // const p = currentRoles.split('_')[1];
  const roles = role_url_map[`${currentRoles}`]; // routing from app

  const pid = location.pathname.split('/')[4];

  // var for else on state in approveProposalPayloads
  // const a = p.toUpperCase();

  useEffect(() => {
    console.log('currentRoles', currentRoles);
    console.log('roles', roles);
  }, [currentRoles, roles]);

  const [proposalRejection, reject] = useMutation(rejectProposalWLog);
  const [proposalAccepting, accept] = useMutation(approveProposalWLog);
  const { fetching: accFetch, error: accError } = proposalAccepting;
  const { fetching: rejFetch, error: rejError } = proposalRejection;
  const [action, setAction] = useState<'accept' | 'reject'>('reject');

  const acceptInnerStatus =
    currentRoles === 'tender_ceo' && action === 'accept'
      ? 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION'
      : 'ACCEPTED_BY_MODERATOR';

  const rejectInnerStatus =
    currentRoles === 'tender_ceo' && action === 'reject'
      ? 'REJECTED_BY_CEO_WITH_COMMENT'
      : 'REJECTED_BY_MODERATOR';

  //create handleclose modal function
  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleOpenModal = () => {
    setModalState(true);
  };

  const handleApproval = async () => {
    await accept({
      proposalLogPayload: {
        id: nanoid(), // generate by nano id
        proposal_id: pid, // from the proposal it self
        reviewer_id: userId, // user id of current user (moderator/ceo)
        organization_id: organizationId, // user id on the proposal data
        inner_status: acceptInnerStatus,
        outter_status: 'ONGOING',
        state: 'PROJECT_SUPERVISOR',
      } as ceoAndModeratorProposalLogPayload,
      proposalId: pid,
      updateProposalStatusAndStatePayloads: {
        inner_status: acceptInnerStatus as InnerStatus,
        outter_status: 'ONGOING',
        state: `${roles.toUpperCase() as AppRole}`,
      } as updateProposalStatusAndState,
    });

    if (!accFetch) {
      enqueueSnackbar(translate('proposal_approved'), {
        variant: 'success',
      });
      navigate(`/${roles}/dashboard/app`);
    }
    if (accError) {
      enqueueSnackbar(accError.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
      console.log(accError);
    }

    if (currentRoles === 'tender_ceo') setModalState(false);
  };

  const handleRejected = async (procedures: string) => {
    await reject({
      proposalLogPayload: {
        id: nanoid(), // generate by nano id
        proposal_id: pid, // from the proposal it self
        reviewer_id: userId, // user id of current user (moderator/ceo)
        organization_id: organizationId, // user id on the proposal data
        inner_status: rejectInnerStatus,
        outter_status: 'CANCELED',
        state: currentRoles === 'tender_ceo' ? 'CEO' : 'MODERATOR',
        procedures,
      } as ceoAndModeratorProposalLogPayload,
      proposalId: pid,
      updateProposalStatusAndStatePayloads: {
        inner_status: rejectInnerStatus as InnerStatus,
        outter_status: 'CANCELED',
        state: `${roles.toUpperCase() as AppRole}`,
      } as updateProposalStatusAndState,
    });

    if (!rejFetch) {
      enqueueSnackbar(translate('proposal_rejected'), {
        variant: 'success',
      });
      navigate(`/${roles}/dashboard/app`);
    }
    if (rejError) {
      enqueueSnackbar(rejError.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
      console.log(rejError);
    }
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 1,
          position: 'sticky',
          width: '100%',
          bottom: 24,
          border: `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="space-between">
          <Stack flexDirection={{ sm: 'column', md: 'row' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: { md: '1em' } }}
              onClick={() => {
                setAction('accept');
                handleOpenModal();
              }}
            >
              {translate('project_acceptance')}
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ my: { xs: '1.3em', md: '0' }, mr: { md: '1em' } }}
              onClick={() => {
                setAction('reject');
                handleOpenModal();
              }}
            >
              {translate('project_rejected')}
            </Button>

            {currentRoles === 'tender_moderator' && (
              <Button variant="outlined" color="primary" sx={{ my: { xs: '1.3em', md: '0' } }}>
                {translate('send_message_to_partner')}
              </Button>
            )}
          </Stack>

          <Button variant="contained" color="info" endIcon={<Iconify icon="eva:edit-2-outline" />}>
            {translate('submit_amendment_request')}
          </Button>
        </Stack>
      </Box>

      <ModalDialog
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {action === 'accept' ? 'Project Accept Form' : 'Project Reject Form'}
            </Typography>
          </Stack>
        }
        content={
          action === 'accept' ? (
            <>
              {currentRoles === 'tender_ceo' ? (
                <ApproveModal
                  action="accept"
                  isLoading={accFetch}
                  onReturn={() => {
                    setModalState(false);
                  }}
                  onSubmited={() => {
                    handleApproval();
                  }}
                />
              ) : (
                <ProposalAcceptingForm
                  onSubmit={(data: any) => {
                    console.log('form callback', data);
                    console.log('just a dummy not create log yet');
                    handleApproval();
                  }}
                >
                  <FormActionBox
                    action="accept"
                    isLoading={accFetch}
                    onReturn={() => {
                      setModalState(false);
                    }}
                  />
                </ProposalAcceptingForm>
              )}
            </>
          ) : (
            <ProposalRejectingForm
              onSubmit={(value: ProposalRejectPayload) => {
                handleRejected(value.procedures);
              }}
            >
              <FormActionBox
                action="reject"
                isLoading={rejFetch}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalRejectingForm>
          )
        }
        isOpen={modalState}
        onClose={handleCloseModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </>
  );
}

export default FloatingActionBar;
