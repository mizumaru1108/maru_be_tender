import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import ModalDialog from 'components/modal-dialog';
import { Role } from 'guards/RoleBasedGuard';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { approveProposal } from 'queries/commons/approveProposal';
import { rejectProposal } from 'queries/commons/rejectProposal';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useMutation } from 'urql';
import FormActionBox from './FormActionBox';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';

function FloatingActionBar() {
  const { user } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const { translate } = useLocales();
  const [modalState, setModalState] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Logic here to get current user role
  const currentRoles = user?.registrations[0].roles[0] as Role;

  // var for insert into navigate in handel Approval and Rejected
  const p = currentRoles.split('_')[1];

  const pid = location.pathname.split('/')[4];

  // var for else on state in approveProposalPayloads
  const a = p.toUpperCase();

  const [proposalRejection, reject] = useMutation(rejectProposal);
  const [proposalAccepting, accept] = useMutation(approveProposal);
  const { fetching: accFetch, error: accError } = proposalAccepting;
  const { fetching: rejFetch, error: rejError } = proposalRejection;
  const [action, setAction] = useState<'accept' | 'reject'>('reject');

  //create handleclose modal function
  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleOpenModal = () => {
    setModalState(true);
  };

  const handleApproval = async () => {
    await accept({
      proposalId: pid,
      approveProposalPayloads: {
        inner_status:
          currentRoles === 'tender_ceo'
            ? 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION'
            : currentRoles === 'tender_moderator'
            ? 'ACCEPTED_BY_MODERATOR'
            : `${a}`, // the next step when accepted
        outter_status: 'ONGOING',
        state:
          currentRoles === 'tender_ceo'
            ? 'PROJECT_SUPERVISOR'
            : currentRoles === 'tender_moderator'
            ? 'PROJECT_SUPERVISOR'
            : `${a}`, // the next step when accepted
      },
    });

    if (!accFetch) {
      enqueueSnackbar('Proposal Approved!', {
        variant: 'success',
      });
      navigate(`/${p}/dashboard/app`);
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
  };

  const handleRejected = async () => {
    await reject({
      proposalId: pid,
      rejectProposalPayloads: {
        inner_status: 'REJECTED',
        outter_status: 'CANCELED',
        state:
          currentRoles === 'tender_moderator'
            ? 'CLIENT'
            : currentRoles === 'tender_ceo'
            ? 'CLIENT'
            : `${a}`,
      },
    });

    if (!rejFetch) {
      enqueueSnackbar('Proposal Rejected Successfully!', {
        variant: 'success',
      });
      navigate(`/${p}/dashboard/app`);
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
              {action === 'accept' ? translate('accept_project') : translate('reject_project')}
            </Typography>
          </Stack>
        }
        content={
          action === 'accept' ? (
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
          ) : (
            <ProposalRejectingForm
              onSubmit={(value: any) => {
                console.log('form callback', value);
                console.log('just a dummy not create log yet');
                handleRejected();
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
