import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ModalDialog from 'components/modal-dialog';
import { useState } from 'react';
import FormActionBox from './FormActionBox';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import { rejectProposal } from 'queries/commons/rejectProposal';
import { approveProposal } from 'queries/commons/approveProposal';
import { CreateProposalLog } from 'queries/commons/createProposalLog';
import { useMutation } from 'urql';
import useAuth from 'hooks/useAuth';
import { Role } from 'guards/RoleBasedGuard';
import { useSnackbar } from 'notistack';
import { nanoid } from 'nanoid';

function FloatingActionBar({ organizationId }: any) {
  const { id } = useParams();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [proposalRejection, reject] = useMutation(rejectProposal);
  const [proposalAccepting, accept] = useMutation(approveProposal);
  const [_, createLog] = useMutation(CreateProposalLog);
  const { fetching: accFetch, error: accError } = proposalAccepting;
  const { fetching: rejFetch, error: rejError } = proposalRejection;
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

  const handleApproval = (values: any) => {
    accept({
      proposalId: id,
      approveProposalPayloads: {
        inner_status: 'ACCEPTED',
        outter_status: 'PENDING',
        state: 'CEO',
      },
    });

    if (!accFetch) {
      enqueueSnackbar('Proposal Approved!', {
        variant: 'success',
      });
      createLog({
        proposalLogPayload: {
          id: nanoid(),
          reviewer_id: user?.id,
          proposal_id: id,
          organization_id: organizationId, // from clientid
          status: 'ACCEPTED',
          assign: 'CEO',
          notes: values.notes,
          procedures: values.procedures,
        },
      });
      navigate('/project-manager/dashboard/app');
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

  const handleRejected = (values: any) => {
    reject({
      proposalId: id,
      rejectProposalPayloads: {
        inner_status: 'REJECTED',
        outter_status: 'CANCELED',
        state: 'CLIENT',
      },
    });

    if (!rejFetch) {
      enqueueSnackbar('Proposal Rejected Successfully!', {
        variant: 'success',
      });
      createLog({
        proposalLogPayload: {
          id: nanoid(),
          reviewer_id: user?.id,
          proposal_id: id,
          organization_id: organizationId, // from clientid
          status: 'ACCEPTED',
          assign: 'CEO', // asfasdf
          notes: values.notes,
          procedures: values.procedures,
        },
      });
      navigate('/project-manager/dashboard/app');
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
            <Button
              variant="contained"
              endIcon={<Iconify icon="eva:edit-2-outline" />}
              onClick={() => setAction('edit_request')}
              sx={{
                flex: 1,
                backgroundColor: '#0169DE',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
            >
              {translate('partner_details.submit_amendment_request')}
            </Button>
          </Grid>
          <Grid item md={7} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                sx={{ flex: 1, '&:hover': { backgroundColor: '#FF170F' } }}
                variant="contained"
                color="error"
                onClick={() => {
                  setAction('reject');
                  handleOpenModal();
                }}
                endIcon={<ClearIcon />}
              >
                {translate('reject_project')}
              </Button>
              <Button
                onClick={() => {
                  setAction('accept');
                  handleOpenModal();
                }}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1, '&:hover': { backgroundColor: '#13B2A2' } }}
              >
                {translate('accept_project')}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<Iconify icon="eva:message-circle-outline" />}
                onClick={() => setAction('send_client_message')}
                sx={{ flex: 2 }}
              >
                عرض المشروع على المستشارين
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
              onSubmit={(values) => {
                console.log('form callback', values);
                console.log('just a dummy not create log yet');
                handleApproval(values);
              }}
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
              onSubmit={(values: any) => {
                console.log('form callback', values);
                console.log('just a dummy not create log yet');
                handleRejected(values);
              }}
            >
              <FormActionBox
                action="reject"
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