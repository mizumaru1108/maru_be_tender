import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import useLocales from 'hooks/useLocales';

type Props = {
  action: 'accept' | 'reject';
  isLoading?: boolean;
  onReturn?: () => void;
};

const FormActionBox = ({ action, isLoading, onReturn }: Props) => {
  const { translate } = useLocales();
  return (
    <Stack justifyContent="center" direction="row" gap={2}>
      <Button
        onClick={() => {
          if (onReturn !== undefined) onReturn();
        }}
        sx={{
          color: '#000',
          size: 'large',
          width: { xs: '100%', sm: '200px' },
          hieght: { xs: '100%', sm: '50px' },
          ':hover': { backgroundColor: '#fff' },
        }}
      >
        {translate('close')}
      </Button>
      <LoadingButton
        loading={isLoading}
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: action === 'accept' ? 'background.paper' : '#FF170F',
          color: '#fff',
          width: { xs: '100%', sm: '200px' },
          hieght: { xs: '100%', sm: '50px' },
          '&:hover': { backgroundColor: action === 'reject' ? '#FF4842' : '#13B2A2' },
        }}
      >
        {action === 'accept' ? translate('accept') : translate('reject')}
      </LoadingButton>
    </Stack>
  );
};

export default FormActionBox;
