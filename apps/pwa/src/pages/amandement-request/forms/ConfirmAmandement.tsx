import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { AmandementFields } from '../../../@types/proposal';
import axiosInstance from '../../../utils/axios';

type Props = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: AmandementFields;
};

function ConfirmAmandement({ open, handleClose, defaultValues }: Props) {
  const { user, activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { pathname } = useLocation();
  const dahsboardUrl = pathname.split('/').slice(0, 3).join('/').concat('/app');

  const handleAccepted = async () => {
    setLoading(true);
    // console.log({ defaultValues });
    try {
      const rest = await axiosInstance.post(
        'tender-proposal/send-amandement',
        {
          ...defaultValues,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Edit request has been approved', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        navigate(dahsboardUrl);
      }
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        }
      );
    }
  };

  return (
    <ModalDialog
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            تأكيد طلب التعديل
          </Typography>
        </Stack>
      }
      showCloseIcon={true}
      actionBtn={
        <Stack direction="row" justifyContent="space-around" gap={4}>
          <Button
            sx={{
              color: '#000',
              size: 'large',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              ':hover': { backgroundColor: '#efefef' },
            }}
            onClick={handleClose}
          >
            رجوع
          </Button>
          <LoadingButton
            onClick={handleAccepted}
            sx={{
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              backgroundColor: '#0E8478',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
            loading={loading}
          >
            اضافة
          </LoadingButton>
        </Stack>
      }
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ConfirmAmandement;
