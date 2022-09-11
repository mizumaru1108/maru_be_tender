// @mui
import { Box, Typography, Stack } from '@mui/material';
// assets
import { UploadIllustration } from '../../assets';

import SvgIconStyle from 'components/SvgIconStyle';
// ----------------------------------------------------------------------

interface Props {
  placeholder?: string;
}

export default function BlockContent({ placeholder }: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      {placeholder ? (
        <Typography gutterBottom sx={{ fontSize: '16px' }}>
          {placeholder}
        </Typography>
      ) : (
        <Typography gutterBottom sx={{ fontSize: '16px' }}>
          Drop or Select file
        </Typography>
      )}

      <img src={`/assets/icons/upload-icon.svg`} style={{ width: 25, height: 25 }} alt="" />
    </Stack>
  );
}
