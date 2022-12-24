import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

type Props = {
  isLoading?: boolean;
  onClose: () => void;
  step: number;
  onBack: () => void;
};

function ActionBox({ isLoading, onClose, step, onBack }: Props) {
  return (
    <Stack justifyContent="center" direction="row" gap={2}>
      <Button
        variant="contained"
        sx={{ backgtroundColor: '#fff', color: '#000', ':hover': { backgroundColor: '#fff' } }}
        disabled={step === 0 ? true : false}
        onClick={onBack}
      >
        رجوع
      </Button>
      <Button
        onClick={onClose}
        sx={{
          color: '#000',
          size: 'large',
          width: { xs: '100%', sm: '200px' },
          hieght: { xs: '100%', sm: '50px' },
        }}
      >
        إغلاق
      </Button>
      <LoadingButton
        loading={isLoading}
        loadingIndicator={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ color: 'white' }} thickness={4} />
            <Typography sx={{ color: 'white', fontSize: '1em', ml: 1 }}>Saving...</Typography>
          </Box>
        }
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: 'background.paper',
          color: '#fff',
          width: { xs: '100%', sm: '200px' },
          hieght: { xs: '100%', sm: '50px' },
          '&:hover': { backgroundColor: '#13B2A2' },
        }}
      >
        {/* {isLoading && <CircularProgress size={23} sx={{ color: 'white' }} thickness={10} />} */}
        {step < 4 ? 'التالي' : 'تأكيد'}
      </LoadingButton>
    </Stack>
  );
}

export default ActionBox;
