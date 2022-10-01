import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useLocation, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ModalDialog from 'components/modal-dialog';
import { useState } from 'react';
import ProposalAcceptingFormSupervisor from './ProposalAcceptingFormSupervisor';
import ProposalRejectingFormSupervisor from './ProposalRejectingFormSupervisor';
import FormActionBox from 'sections/ceo/forms/FormActionBox';

function SupervisorFloatingActionBar() {
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
                sx={{ flex: 1 }}
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
                color="info"
                endIcon={<Iconify icon="eva:edit-2-outline" />}
                onClick={() => setAction('edit_request')}
                sx={{ flex: 1 }}
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
            <ProposalAcceptingFormSupervisor
              onSubmit={(data) => {
                console.log('form callback', data);
                console.log('just a dummy not create log yet');
                // handleApproval();
              }}
            >
              <FormActionBox
                action="accept"
                isLoading={false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingFormSupervisor>
          ) : (
            <ProposalRejectingFormSupervisor
              onSubmit={(value: any) => {
                console.log('form callback', value);
                console.log('just a dummy not create log yet');
                // handleRejected();
              }}
            >
              <FormActionBox
                action="accept"
                isLoading={false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalRejectingFormSupervisor>
          )
        }
        isOpen={modalState}
        onClose={handleCloseModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </>
  );
}

export default SupervisorFloatingActionBar;
