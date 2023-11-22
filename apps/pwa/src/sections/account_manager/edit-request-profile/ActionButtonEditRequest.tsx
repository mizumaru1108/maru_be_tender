import { Box, Button, Grid, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useState } from 'react';
import ConfirmApprovedEditRequest from './ConfirmApprovedEditRequest';
import { IEditedValues } from '../../../@types/client_data';

interface Props {
  open: boolean;
  EditStatus: string;
  setOpen: () => void;
  EditValues: {
    old_data: IEditedValues;
    new_data: IEditedValues;
    difference: IEditedValues;
  };
}

function ActionButtonEditRequest({ open, EditValues, EditStatus, setOpen }: Props) {
  const [openModal, setOpenModal] = useState(open);
  const { translate } = useLocales();
  const theme = useTheme();

  const handleRejected = () => {
    setOpen();
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
        width: '100%',
        bottom: 24,
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <Grid container spacing={2} justifyContent={{ xs: 'space-around', md: 'center' }}>
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
          <ConfirmApprovedEditRequest
            open={openModal}
            handleClose={() => setOpenModal(false)}
            EditValues={EditValues}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActionButtonEditRequest;
