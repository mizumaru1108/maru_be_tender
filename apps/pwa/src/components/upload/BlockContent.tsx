// @mui
import { Typography, Stack } from '@mui/material';
// assets

import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------

interface Props {
  placeholder?: string;
  uploading?: boolean;
}

export default function BlockContent({ placeholder, uploading }: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: 'column', md: 'column' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' }, my: '10px' }}
    >
      <img
        src={`/icons/uploading-field/first-field-icon.svg`}
        style={{ width: 25, height: 25 }}
        alt=""
      />
      {placeholder ? (
        <Typography gutterBottom sx={{ fontSize: '16px' }}>
          {placeholder}
        </Typography>
      ) : (
        <Typography gutterBottom sx={{ fontSize: '16px' }}>
          Drop or Select file
        </Typography>
      )}
      <LoadingButton
        size="large"
        loading={uploading}
        sx={{
          '&.MuiButtonBase-root:hover': {
            bgcolor: 'transparent',
          },
          bgcolor: 'transparent',
        }}
      >
        {uploading ? <></> : <img src={`/icons/uploading-field/second-field-icon.svg`} alt="" />}
      </LoadingButton>
    </Stack>
  );
}
