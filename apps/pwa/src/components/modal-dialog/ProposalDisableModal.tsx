import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import { useNavigate } from 'react-router';
import useLocales from '../../hooks/useLocales';

type Props = {
  open: boolean;
  redirectType?: 'home' | 'back';
  message: string[];
};

function ProposalDisableModal({ open, message, redirectType = 'home' }: Props) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const handleRedirect = async () => {
    if (redirectType === 'home') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <ModalDialog
      maxWidth="md"
      content={
        <Stack
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            py: { xs: 2, md: 7 },
            px: { xs: 2, md: 5 },
          }}
        >
          {message.length > 0 &&
            message.map((item, index) => (
              <Typography key={index} color="#000000" sx={{ fontSize: '19.39px', fontWeight: 400 }}>
                {translate(item)}
              </Typography>
            ))}
        </Stack>
      }
      showCloseIcon={false}
      actionBtn={
        <Stack direction="row" justifyContent="space-around" paddingY={2}>
          <LoadingButton
            data-cy="button.back"
            onClick={handleRedirect}
            fullWidth
            size="large"
            sx={{
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              backgroundColor: '#0E8478',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
          >
            {translate('button.back')}
          </LoadingButton>
        </Stack>
      }
      isOpen={open}
      onClose={() => {
        console.error('Propoal Disabled');
      }}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ProposalDisableModal;
