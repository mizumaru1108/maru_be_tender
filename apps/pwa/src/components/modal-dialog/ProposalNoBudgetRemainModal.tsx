import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import { useNavigate } from 'react-router';
import useLocales from '../../hooks/useLocales';

type Props = {
  open: boolean;
  message: string;
  isAvailBudget: boolean;
  handleClose: () => void;
  handleOnContinue: () => void;
};

function ProposalNoBudgetRemainModal({
  open,
  message,
  isAvailBudget,
  handleClose,
  handleOnContinue,
}: Props) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const handleRedirect = async () => {
    navigate(-1);
  };

  return (
    <ModalDialog
      maxWidth="md"
      content={
        <Stack sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', py: 7, px: 5 }}>
          <Typography color="#000000" sx={{ fontSize: '19.39px', fontWeight: 400 }}>
            {message}
          </Typography>
        </Stack>
      }
      showCloseIcon={false}
      actionBtn={
        <Stack direction="row" justifyContent="space-around" paddingY={2}>
          <Button
            variant="outlined"
            onClick={handleRedirect}
            sx={{ width: { xs: '100%', sm: '200px' }, hieght: { xs: '100%', sm: '50px' }, mx: 1 }}
          >
            {translate('button.back')}
          </Button>
          {isAvailBudget && (
            <LoadingButton
              data-cy="button.back"
              onClick={handleOnContinue}
              sx={{
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                mx: 1,
                backgroundColor: '#0E8478',
                ':hover': { backgroundColor: '#13B2A2' },
              }}
            >
              {translate('button.continue')}
            </LoadingButton>
          )}
        </Stack>
      }
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ProposalNoBudgetRemainModal;
