import { LoadingButton } from '@mui/lab';
import { Box, Stack } from '@mui/material';
import useLocales from 'hooks/useLocales';
// import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';

type PROPS = {
  onReturn: () => void;
  lastStep?: boolean;
  isLoad?: boolean;
};
const PortalReportActionBox = ({ onReturn, lastStep = false, isLoad }: PROPS) => {
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
          // endIcon={!isLoad && <MovingBack />}
          sx={{
            color: 'text.primary',
            width: { xs: '100%', sm: '200px' },
            hieght: { xs: '100%', sm: '50px' },
          }}
        >
          {translate('going_back_one_step')}
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
          {lastStep ? translate('send') : translate('next')}
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default PortalReportActionBox;
