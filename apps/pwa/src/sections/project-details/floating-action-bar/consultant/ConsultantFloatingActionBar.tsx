import { Box, Stack, useTheme, Button } from '@mui/material';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { AcceptProposalByConsultant } from 'queries/consultant/AcceptProposalByConsultant';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';
import { useSnackbar } from 'notistack';

function ConsultantFloatingActionBar() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { id: proposal_id } = useParams();
  const [, update] = useMutation(AcceptProposalByConsultant);
  const theme = useTheme();

  const handleAccept = async () => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'ACCEPTED_BY_CONSULTANT',
        outter_status: 'ONGOING',
        state: 'CEO',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مدير المشاريع ',
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
    }).then((res) => {
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
        navigate(`/consultant/dashboard/app`);
      }
    });
  };
  const handleReject = async () => {
    update({
      proposal_id,
      new_values: {
        inner_status: 'REJECTED_BY_CONSULTANT',
        outter_status: 'ONGOING',
        state: 'PROJECT_MANAGER',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مدير المشاريع ',
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
    }).then((res) => {
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
        navigate(`/consultant/dashboard/app`);
      }
    });
  };
  return (
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
        <Button
          variant="contained"
          onClick={() => {
            console.log('asdasdasdasd');
          }}
          sx={{ backgroundColor: '#0169DE', ':hover': { backgroundColor: '#1482FE' } }}
          endIcon={<Iconify icon="eva:edit-2-outline" />}
        >
          {translate('submit_amendment_request')}
        </Button>
        <Stack flexDirection={{ sm: 'column', md: 'row' }}>
          <Button
            variant="contained"
            sx={{
              my: { xs: '1.3em', md: '0' },
              mr: { md: '1em' },
              backgroundColor: '#FF4842',
              ':hover': { backgroundColor: '#FF170F' },
            }}
            onClick={handleReject}
          >
            {translate('project_rejected')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: { md: '1em' } }}
            onClick={handleAccept}
          >
            {translate('project_acceptance')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ConsultantFloatingActionBar;
