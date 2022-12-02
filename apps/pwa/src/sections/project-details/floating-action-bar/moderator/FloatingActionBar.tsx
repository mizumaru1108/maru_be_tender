import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import ModalDialog from 'components/modal-dialog';

import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByModerator } from 'queries/Moderator/updateProposalByModerator';
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

  const pid = location.pathname.split('/')[4];

  const [, update] = useMutation(updateProposalByModerator);

  const [loadingState, setLoadingState] = useState({ isLoading: false, action: '' });

  const [action, setAction] = useState<'accept' | 'reject'>('reject');

  const amandementPath = location.pathname.split('show-details')[0] + `amandementRequest`;

  //create handleclose modal function
  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleOpenModal = () => {
    setModalState(true);
  };

  const handleApproval = async (data: any) => {
    setLoadingState({ action: 'accept', isLoading: true });
    update({
      proposal_id: pid,
      new_values: {
        inner_status: 'ACCEPTED_BY_MODERATOR',
        outter_status: 'ONGOING',
        state: 'PROJECT_SUPERVISOR',
        project_track: data.path,
        ...(data.supervisors !== 'all' && { supervisor_id: data.supervisors }),
      },
      log: {
        id: nanoid(),
        proposal_id: pid,
        reviewer_id: user?.id!,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
        user_role: 'MODERATOR',
        state: 'MODERATOR',
      },
    }).then((res) => {
      setLoadingState({ action: 'accept', isLoading: false });
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_accept'), {
          variant: 'success',
        });
        navigate(`/moderator/dashboard/app`);
      }
    });
  };

  const handleRejected = async (data: any) => {
    setLoadingState({ action: 'reject', isLoading: true });
    update({
      proposal_id: pid,
      new_values: {
        inner_status: 'REJECTED_BY_MODERATOR',
        outter_status: 'CANCELED',
        state: 'MODERATOR',
        project_track: data.path,
      },
      log: {
        id: nanoid(),
        proposal_id: pid,
        reviewer_id: user?.id!,
        action: 'reject',
        message: 'تم رفض المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
        user_role: 'MODERATOR',
        state: 'MODERATOR',
      },
    }).then((res) => {
      setLoadingState({ action: 'reject', isLoading: false });
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_rejected'), {
          variant: 'success',
        });
        navigate(`/moderator/dashboard/app`);
      }
    });
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

            <Button
              variant="outlined"
              color="primary"
              sx={{ my: { xs: '1.3em', md: '0' }, ':hover': { backgroundColor: '#fff' } }}
            >
              {translate('send_message_to_partner')}
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
                handleApproval(data);
              }}
            >
              <FormActionBox
                action="accept"
                isLoading={loadingState.action === 'accept' ? loadingState.isLoading : false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingForm>
          ) : (
            <ProposalRejectingForm onSubmit={handleRejected}>
              <FormActionBox
                action="reject"
                isLoading={loadingState.action === 'reject' ? loadingState.isLoading : false}
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
