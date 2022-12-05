import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

type Props = {
  action: 'accept' | 'reject';
  isLoading?: boolean;
  onReturn?: () => void;
};

const FormActionBox = ({ action, isLoading, onReturn }: Props) => (
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
      إغلاق
    </Button>
    <LoadingButton
      loading={isLoading}
      type="submit"
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
        color: '#fff',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
        '&.Mui-disabled': {
          backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
          color: '#fff',
          opacity: 0.48,
        },
        '&:hover': { backgroundColor: action === 'reject' ? '#FF4842' : '#13B2A2' },
      }}
      disabled={isLoading}
    >
      {action === 'accept' ? 'قبول' : 'رفض'}
    </LoadingButton>
  </Stack>
);

export default FormActionBox;
