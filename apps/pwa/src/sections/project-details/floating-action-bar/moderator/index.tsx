import { Box, Button, Stack, useTheme } from '@mui/material';
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

function ModeratorActionBar() {
  const { user } = useAuth();

  const { id } = useParams();

  const theme = useTheme();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [, update] = useMutation(updateProposalByModerator);

  const [action, setAction] = useState<'accept' | 'reject' | ''>('');

  const handleOnCloseModal = () => {
    setAction('');
  };

  const handleApproval = async (data: any) => {
    update({
      proposal_id: id,
      new_values: {
        inner_status: 'ACCEPTED_BY_MODERATOR',
        outter_status: 'ONGOING',
        state: 'PROJECT_SUPERVISOR',
        project_track: data.path,
        ...(data.supervisors !== 'all' && { supervisor_id: data.supervisors }),
      },
      log: {
        id: nanoid(),
        proposal_id: id,
        reviewer_id: user?.id!,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
        user_role: 'MODERATOR',
        state: 'MODERATOR',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_approved'), {
          variant: 'success',
        });
        navigate(`/moderator/dashboard/app`);
      }
    });
  };

  const handleRejected = async (data: any) => {
    update({
      proposal_id: id,
      new_values: {
        inner_status: 'REJECTED_BY_MODERATOR',
        outter_status: 'CANCELED',
        state: 'MODERATOR',
        project_track: data.path,
      },
      log: {
        id: nanoid(),
        proposal_id: id,
        reviewer_id: user?.id!,
        action: 'reject',
        message: 'تم رفض المشروع من قبل مسوؤل الفرز',
        notes: data.notes,
        user_role: 'MODERATOR',
        state: 'MODERATOR',
      },
    }).then((res) => {
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
              onClick={() => setAction('accept')}
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
              onClick={() => setAction('reject')}
            >
              {translate('project_rejected')}
            </Button>
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
        <ProposalAcceptingForm onClose={handleOnCloseModal} onSubmit={handleApproval} />
      )}
      {action === 'reject' && (
        <ProposalRejectingForm onClose={handleOnCloseModal} onSubmit={handleRejected} />
      )}
    </>
  );
}

export default ModeratorActionBar;
