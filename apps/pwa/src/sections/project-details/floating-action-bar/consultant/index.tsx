import { Box, Stack, useTheme, Button } from '@mui/material';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { AcceptProposalByConsultant } from 'queries/consultant/AcceptProposalByConsultant';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import { useSnackbar } from 'notistack';
import { UpdateAction } from '../../../../@types/project-details';
import { useState } from 'react';
import NotesModal from 'components/notes-modal';
//
import axiosInstance from 'utils/axios';
import { LoadingButton } from '@mui/lab';

function ConsultantFloatingActionBar() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, activeRole } = useAuth();

  const { translate } = useLocales();

  const navigate = useNavigate();

  const [action, setAction] = useState<UpdateAction>('');

  const { id: proposal_id } = useParams();

  const [, update] = useMutation(AcceptProposalByConsultant);

  const theme = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingRejected, setIsSubmittingRejected] = useState<boolean>(false);

  const handleCloseModal = () => {
    setAction('');
  };

  const handleApproval = async (values: any) => {
    setIsSubmitting(true);

    try {
      const payload = {
        proposal_id,
        action: 'accept',
        message: 'تم قبول المشروع من قبل لجنة المستشارين ',
        notes: values.notes,
      };

      console.log('payloadApprovalConsultant', payload);

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
          navigate(`/consultant/dashboard/app`);
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

      setIsSubmitting(false);
    }
  };

  const handleRejected = async (values: any) => {
    setIsSubmittingRejected(true);

    try {
      const payload = {
        proposal_id,
        action: 'reject',
        message: 'تم قبول المشروع من قبل مدير المشاريع ',
        notes: values.notes,
      };

      console.log('payloadRejectedConsultant', payload);

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

          setIsSubmitting(false);
          navigate(`/consultant/dashboard/app`);
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

      setIsSubmittingRejected(false);
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
          {/* disabled other than accept reject button */}
          {/* <Button
            variant="contained"
            onClick={() => {
              console.log('asdasdasdasd');
            }}
            sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
            endIcon={<Iconify icon="eva:edit-2-outline" />}
          >
            {translate('submit_amendment_request')}
          </Button> */}
          <Stack flexDirection={{ sm: 'column', md: 'row' }}>
            <LoadingButton
              variant="contained"
              sx={{
                my: { xs: '1.3em', md: '0' },
                mr: { md: '1em' },
                backgroundColor: '#FF4842',
                ':hover': { backgroundColor: '#FF170F' },
              }}
              onClick={() => setAction('REJECT')}
              loading={isSubmittingRejected}
            >
              {translate('project_rejected')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ mr: { md: '1em' } }}
              onClick={() => setAction('ACCEPT')}
              loading={isSubmitting}
            >
              {translate('project_acceptance')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
      {action === 'REJECT' && (
        <NotesModal
          title="رفض المشروع وإعادته لمدير الإدارة"
          onClose={handleCloseModal}
          onSubmit={handleRejected}
          action={{
            actionType: action,
            actionLabel: 'رفض',
            backgroundColor: '#FF0000',
            hoverColor: '#FF4842',
          }}
        />
      )}
      {action === 'ACCEPT' && (
        <NotesModal
          title="قبول المشروع"
          onClose={handleCloseModal}
          onSubmit={handleApproval}
          action={{
            actionType: action,
            actionLabel: 'قبول',
            backgroundColor: 'background.paper',
            hoverColor: '#13B2A2',
          }}
          loading={isSubmitting}
        />
      )}
    </>
  );
}

export default ConsultantFloatingActionBar;
