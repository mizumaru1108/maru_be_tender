import { Box, Button, Stack, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByModerator } from 'queries/Moderator/updateProposalByModerator';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import axiosInstance from 'utils/axios';

function ModeratorActionBar() {
  const { user, activeRole } = useAuth();

  const { id } = useParams();

  const theme = useTheme();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [, update] = useMutation(updateProposalByModerator);

  const [action, setAction] = useState<'accept' | 'reject' | ''>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);

  const handleOnCloseModal = () => {
    setAction('');
  };

  const handleApproval = async (data: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id: id,
        action: 'accept',
        moderator_payload: {
          project_track: data.path,
          ...(data.supervisors !== 'all' && { supervisor_id: data.supervisors }),
        },
        message: 'تم قبول المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
      };
      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_approved'), {
              variant: 'success',
            });
          }

          setIsSubmitting(false);
          navigate(`/moderator/dashboard/app`);
        })
        .catch((err) => {
          if (typeof err.message === 'object') {
            err.message.forEach((el: any) => {
              enqueueSnackbar(el, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 3000,
              });
            });
          } else {
            enqueueSnackbar(err.message, {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 3000,
            });
          }

          setIsSubmitting(false);
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
    }
  };

  const handleRejected = async (data: any) => {
    setIsSubmittingRejected(true);

    try {
      const payload = {
        proposal_id: id,
        action: 'reject',
        moderator_payload: {
          project_track: data.path,
        },
        message: 'تم رفض المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
      };

      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_rejected'), {
              variant: 'success',
            });
          }

          setIsSubmittingRejected(false);
          navigate(`/moderator/dashboard/app`);
        })
        .catch((err) => {
          if (typeof err.message === 'object') {
            err.message.forEach((el: any) => {
              enqueueSnackbar(el, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 3000,
              });
            });
          } else {
            enqueueSnackbar(err.message, {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 3000,
            });
          }

          setIsSubmittingRejected(false);
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
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
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="primary"
              sx={{ mr: { md: '1em' } }}
              onClick={() => setAction('accept')}
            >
              {translate('project_acceptance')}
            </LoadingButton>
            <LoadingButton
              loading={isSubmittingRejected}
              variant="contained"
              sx={{
                my: { xs: '1.3em', md: '0' },
                mr: { md: '1em' },
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => setAction('reject')}
            >
              {translate('project_rejected')}
            </LoadingButton>
            {/* here where Yayan should complete from  "send_message_to_partner"*/}
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
            onClick={() => {}}
            sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
            endIcon={<Iconify icon="eva:edit-2-outline" />}
          >
            {translate('submit_amendment_request')}
          </Button>
        </Stack>
      </Box>
      {action === 'accept' && (
        <ProposalAcceptingForm
          onClose={handleOnCloseModal}
          onSubmit={handleApproval}
          loading={isSubmitting}
        />
      )}
      {action === 'reject' && (
        <ProposalRejectingForm
          onClose={handleOnCloseModal}
          onSubmit={handleRejected}
          loading={isSubmittingRejected}
        />
      )}
    </>
  );
}

export default ModeratorActionBar;
