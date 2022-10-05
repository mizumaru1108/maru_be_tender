import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

type Props = {
  isLoading?: boolean;
  onReturn?: () => void;
};

const FormActionBox = ({ isLoading, onReturn }: Props) => (
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
      }}
    >
      Close
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
        // when button is disabled, reduce opacity to 0.5
        '&.Mui-disabled': {
          backgroundColor: 'background.paper',
          color: '#fff',
          opacity: 0.48,
        },
        '&:hover': { backgroundColor: '#13B2A2' },
      }}
      disabled={isLoading}
    >
      {isLoading && <CircularProgress size={23} sx={{ color: 'white' }} thickness={10} />}
      Submit
    </LoadingButton>
  </Stack>
);

export default FormActionBox;
