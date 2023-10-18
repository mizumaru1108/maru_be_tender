import { LoadingButton } from '@mui/lab';
import { Box, Stack } from '@mui/material';
import useLocales from 'hooks/useLocales';
// import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';

type PROPS = {
  onReturn: () => void;
  isLoad?: boolean;
};
const SendEmailActionBox = ({ onReturn, isLoad }: PROPS) => {
  const { translate } = useLocales();

  return (
    <Stack direction="row" justifyContent="center" sx={{ marginTop: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 2,
          backgroundColor: '#fff',
          padding: '24px',
        }}
      >
        <LoadingButton
          onClick={onReturn}
          loading={isLoad}
          sx={{
            color: 'text.primary',
            width: { xs: '100%', sm: '200px' },
            hieght: { xs: '100%', sm: '50px' },
          }}
        >
          {translate('back')}
        </LoadingButton>
        <Box sx={{ width: '10px' }} />
        <LoadingButton
          loading={isLoad}
          type="submit"
          variant="outlined"
          sx={{
            backgroundColor: 'background.paper',
            color: '#fff',
            width: { xs: '100%', sm: '200px' },
            hieght: { xs: '100%', sm: '50px' },
            '&:hover': { backgroundColor: '#0E8478' },
          }}
        >
          {translate('send')}
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default SendEmailActionBox;
