import { Box, Button, Grid, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useState } from 'react';
import ConfirmApprovedEditRequest from './ConfirmApprovedEditRequest';

interface Props {
  EditStatus: string;
  setOpen: () => void;
}

function ActionButtonEditRequest({ EditStatus, setOpen }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const { translate } = useLocales();
  const theme = useTheme();

  const handleRejected = () => {
    setOpen();
    // alert('Accept Edit Request');
  };

  const handleAccepted = async () => {
    setOpenModal(!openModal);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 3,
        borderRadius: 1,
        position: 'sticky',
        width: '40%',
        bottom: 24,
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item>
          <Button
            onClick={() => handleAccepted()}
            variant="contained"
            color="primary"
            disabled={EditStatus === 'APPROVED'}
            // disabled
          >
            {translate('account_manager.button.approveEdit')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRejected()}
            disabled={EditStatus === 'REJECTED' || EditStatus === 'APPROVED'}
            // disabled
          >
            {translate('account_manager.button.rejectEdit')}
          </Button>
          <ConfirmApprovedEditRequest open={openModal} handleClose={() => setOpenModal(false)} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActionButtonEditRequest;
