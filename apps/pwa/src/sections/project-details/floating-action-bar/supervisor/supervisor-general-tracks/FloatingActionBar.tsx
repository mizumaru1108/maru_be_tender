import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ModalDialog from 'components/modal-dialog';
import { useState } from 'react';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import FormActionBox from './FormActionBox';
import { nanoid } from 'nanoid';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useMutation } from 'urql';
import { rejectProposal } from 'queries/commons/rejectProposal';
import { approveProposal } from 'queries/commons/approveProposal';
import { insertSupervisor } from 'queries/project-supervisor/insertSupervisor';

function FloatingActionBar({ organizationId, data }: any) {
  const { id } = useParams();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [proposalRejection, reject] = useMutation(rejectProposal);
  const [proposalAccepting, accept] = useMutation(approveProposal);
  const [supervisorAcceptance, insertSupervisorAcceptance] = useMutation(insertSupervisor);
  const { fetching: accFetch, error: accError } = proposalAccepting;
  const { fetching: rejFetch, error: rejError } = proposalRejection;
  const { fetching: insSupFetch, error: insSupError } = supervisorAcceptance;
  const { translate } = useLocales();
  const theme = useTheme();
  const [action, setAction] = useState<
    'accept' | 'reject' | 'edit_request' | 'send_client_message'
  >('reject');
  const [modalState, setModalState] = useState(false);
  const handleOpenModal = () => {
    setModalState(true);
  };
  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleApproval = async (values: any) => {
    await insertSupervisorAcceptance({
      supervisorAcceptance: {
        ...values,
        id: nanoid(),
        proposal_id: id,
        user_id: organizationId,
      },
    });
    await accept({
      proposalId: id,
      approveProposalPayloads: {
        inner_status: 'ACCEPTED_BY_SUPERVISOR',
        outter_status: 'PENDING',
        state: 'PROJECT_MANAGER',
        number_of_payments: values.number_of_payments,
      },
    });

    if (!accFetch) {
      enqueueSnackbar(translate('proposal_approved'), {
        variant: 'success',
      });
      navigate('/project-supervisor/dashboard/app');
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

  const handleRejected = async (values: any) => {
    await reject({
      proposalId: id,
      rejectProposalPayloads: {
        inner_status: 'REJECTED',
        outter_status: 'PENDING',
        state: 'PROJECT_MANAGER',
      },
    });
    if (!rejFetch) {
      enqueueSnackbar(translate('proposal_rejected'), {
        variant: 'success',
      });
      navigate('/project-supervisor/dashboard/app');
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
        <Grid container rowSpacing={5} alignItems="center" justifyContent="space-around">
          <Grid item md={5} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                onClick={() => {
                  setAction('accept');
                  handleOpenModal();
                }}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1 }}
              >
                {translate('accept_project')}
              </Button>
              <Button
                sx={{
                  flex: 1,
                  backgroundColor: '#FF4842',
                  ':hover': { backgroundColor: '#FF170F' },
                }}
                variant="contained"
                onClick={() => {
                  setAction('reject');
                  handleOpenModal();
                }}
                endIcon={<ClearIcon />}
              >
                {translate('reject_project')}
              </Button>
            </Stack>
          </Grid>
          <Grid item md={2}>
            <Box>{''}</Box>
          </Grid>
          <Grid item md={5}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<Iconify icon="eva:message-circle-outline" />}
                onClick={() => setAction('send_client_message')}
                sx={{ flex: 1 }}
              >
                {translate('partner_details.send_messages')}
              </Button>
              <Button
                variant="contained"
                endIcon={<Iconify icon="eva:edit-2-outline" />}
                onClick={() => setAction('edit_request')}
                sx={{
                  flex: 1,
                  backgroundColor: '#0169DE',
                  ':hover': { backgroundColor: '#1482FE' },
                }}
              >
                {translate('partner_details.submit_amendment_request')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <ModalDialog
        maxWidth="md"
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
                handleApproval(data);
              }}
              data={data}
            >
              <FormActionBox
                action="accept"
                isLoading={false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingForm>
          ) : (
            <ProposalRejectingForm
              onSubmit={(data) => {
                handleRejected(data);
              }}
            >
              <FormActionBox
                action="accept"
                isLoading={false}
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
