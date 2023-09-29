import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import { useNavigate } from 'react-router';
import useLocales from '../../hooks/useLocales';

type Props = {
  open: boolean;
  // handleClose: () => void;
  // onSumbit: () => void;
  message: string;
};

function ProposalDisableModal({ open, message }: Props) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const handleRedirect = async () => {
    navigate('/');
    // onSumbit();
    // handleClose();
  };

  return (
    <ModalDialog
      maxWidth="md"
      content={
        <Stack sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', py: 7 }}>
          <Typography color="#000000" sx={{ fontSize: '19.39px', fontWeight: 400 }}>
            {message}
          </Typography>
        </Stack>
      }
      showCloseIcon={false}
      actionBtn={
        <Stack direction="row" justifyContent="space-around" paddingY={2}>
          <LoadingButton
            data-cy="button.back"
            onClick={handleRedirect}
            sx={{
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              backgroundColor: '#0E8478',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
          >
            {/* اضافة */}
            {translate('button.back')}
          </LoadingButton>
        </Stack>
      }
      isOpen={open}
      onClose={() => {
        console.log('disable proposal this week');
      }}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ProposalDisableModal;
