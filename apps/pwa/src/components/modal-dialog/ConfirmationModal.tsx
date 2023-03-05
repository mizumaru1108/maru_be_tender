import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import useLocales from '../../hooks/useLocales';

type Props = {
  open: boolean;
  handleClose: () => void;
  onSumbit: () => void;
  message: string;
};

function ConfirmationModal({ open, handleClose, onSumbit, message }: Props) {
  const { translate } = useLocales();
  const handleAccepted = async () => {
    onSumbit();
  };

  return (
    <ModalDialog
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            {message}
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
            {/* رجوع */}
            {translate('button.cancel')}
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
            // loading={loading}
          >
            {/* اضافة */}
            {translate('button.confirm')}
          </LoadingButton>
        </Stack>
      }
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ConfirmationModal;
