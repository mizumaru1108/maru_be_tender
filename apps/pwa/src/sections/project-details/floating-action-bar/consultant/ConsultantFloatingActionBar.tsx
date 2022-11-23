import { Box, Stack, useTheme, Button } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { approveProposal } from 'queries/commons/approveProposal';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'urql';

function ConsultantFloatingActionBar() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { id: proposal_id } = useParams();
  const [acceptRes, accept] = useMutation(approveProposal);
  const [rejRes, reject] = useMutation(approveProposal);
  const theme = useTheme();

  const handleAccept = async () => {
    try {
      await accept({
        proposalId: proposal_id,
        approveProposalPayloads: {
          inner_status: 'ACCEPTED_BY_CONSULTANT',
          outter_status: 'PENDING',
          state: 'CEO',
        },
      });
      navigate('/consultant/dashboard/app');
    } catch (error) {}
  };
  const handleReject = async () => {
    try {
      await reject({
        proposalId: proposal_id,
        approveProposalPayloads: {
          inner_status: 'REJECTED_BY_CONSULTANT',
          outter_status: 'PENDING',
          state: 'PROJECT_MANAGER',
        },
      });
      navigate('/consultant/dashboard/app');
    } catch (error) {}
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
