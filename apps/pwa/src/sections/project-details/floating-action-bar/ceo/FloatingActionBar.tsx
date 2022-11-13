import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import ModalDialog from 'components/modal-dialog';

import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useMutation } from 'urql';
import {
  AppRole,
  FusionAuthRoles,
  InnerStatus,
  role_url_map,
  updateProposalStatusAndState,
} from '../../../../@types/commons';
import { approveProposalWLog } from '../../../../queries/commons/approveProposalWithLog';
import { rejectProposalWLog } from '../../../../queries/commons/rejectProposalWithLog';
import ApproveModal from './ApproveModal';
import FormActionBox from './FormActionBox';
import ProposalRejectingForm from './ProposalRejectingForm';
import {
  ceoProposalLogPayload,
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
  const currentRoles = user?.registrations[0].roles[0] as FusionAuthRoles;
  const userId = user?.id;

  const roles = role_url_map[`${currentRoles}`];

  const pid = location.pathname.split('/')[4];

  const [proposalRejection, reject] = useMutation(rejectProposalWLog);
  const [proposalAccepting, accept] = useMutation(approveProposalWLog);
  const { fetching: accFetch, error: accError } = proposalAccepting;
  const { fetching: rejFetch, error: rejError } = proposalRejection;
  const [action, setAction] = useState<'accept' | 'reject'>('reject');
  const amandementPath = location.pathname.split('show-details')[0] + `amandementRequest`;

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
        reviewer_id: userId, // user id of current user
        client_user_id: organizationId, // user id on the proposal data
        inner_status: 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
        outter_status: 'PENDING',
        state: 'PROJECT_SUPERVISOR',
      } as any,
      proposalId: pid,
      updateProposalStatusAndStatePayloads: {
        inner_status: 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION' as InnerStatus,
        outter_status: 'ONGOING',
        state: `PROJECT_SUPERVISOR`,
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

    setModalState(false);
  };

  const handleRejected = async (procedures: string) => {
    await reject({
      proposalLogPayload: {
        id: nanoid(), // generate by nano id
        proposal_id: pid, // from the proposal it self
        reviewer_id: userId, // user id of current user
        organization_id: organizationId, // user id on the proposal data
        inner_status: 'REJECTED_BY_CEO_WITH_COMMENT',
        outter_status: 'CANCELED',
        state: 'CEO',
        procedures,
      } as ceoProposalLogPayload,
      proposalId: pid,
      updateProposalStatusAndStatePayloads: {
        inner_status: 'REJECTED_BY_CEO_WITH_COMMENT' as InnerStatus,
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
              sx={{
                my: { xs: '1.3em', md: '0' },
                mr: { md: '1em' },
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => {
                setAction('reject');
                handleOpenModal();
              }}
            >
              {translate('project_rejected')}
            </Button>
          </Stack>

          <Button
            variant="contained"
            onClick={() => {
              navigate(amandementPath);
            }}
            sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
            endIcon={<Iconify icon="eva:edit-2-outline" />}
          >
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
