import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import React from 'react';
type Props = {
  action: 'accept' | 'reject';
  isLoading?: boolean;
  onReturn?: () => void;
  step: number;
  onBack: () => void;
};

function ActionBox({ action, isLoading, onReturn, step, onBack }: Props) {
  return (
    <Stack justifyContent="center" direction="row" gap={2}>
      <Button
        sx={{ backgtroundColor: '#fff', color: '#000', ':hover': { backgroundColor: '#fff' } }}
        disabled={step === 0 ? true : false}
        onClick={onBack}
      >
        رجوغ
      </Button>
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
          backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
          color: '#fff',
          width: { xs: '100%', sm: '200px' },
          hieght: { xs: '100%', sm: '50px' },
          // when button is disabled, reduce opacity to 0.5
          '&.Mui-disabled': {
            backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
            color: '#fff',
            opacity: 0.48,
          },
          '&:hover': { backgroundColor: action === 'reject' ? '#FF170' : '#13B2A2' },
        }}
        disabled={isLoading}
      >
        {isLoading && <CircularProgress size={23} sx={{ color: 'white' }} thickness={10} />}
        {action === 'accept' ? (step < 4 ? 'التالي' : 'تأكيد') : 'رفض'}
      </LoadingButton>
    </Stack>
  );
}

export default ActionBox;
