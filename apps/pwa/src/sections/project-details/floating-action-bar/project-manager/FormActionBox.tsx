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
        ':hover': { backgroundColor: '#efefef' },
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
        backgroundColor: action === 'accept' ? 'background.paper' : '#FF4842',
        color: '#fff',
        width: { xs: '100%', sm: '200px' },
        hieght: { xs: '100%', sm: '50px' },
        '&:hover': { backgroundColor: action === 'reject' ? '#FF170F' : '#13B2A2' },
      }}
    >
      {action === 'accept' ? 'قبول' : 'رفض'}
    </LoadingButton>
  </Stack>
);

export default FormActionBox;
