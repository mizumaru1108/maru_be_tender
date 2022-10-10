import { Stack, Typography } from '@mui/material';
import useLocales from '../../../hooks/useLocales';
import Iconify from '../../Iconify';

export default function MessageMenuHeader() {
  const { translate } = useLocales();
  return (
    <Stack
      direction="row"
      display="flex"
      gap="24px"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        marginTop: '0px !important',
        '& .MuiStack-root.:not(style)+:not(style)': {
          marginTop: 0,
          paddingTop: '8px',
        },
      }}
    >
      <Stack
        display="flex"
        direction="row"
        onClick={() => alert('Clicked')}
        sx={{
          width: '82px',
          height: '38px',
          borderRadius: '8px',
          color: '#000',
          backgroundColor: '#fff',
          border: '1px solid #000',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Iconify icon={'clarity:filter-line'} color="#000" width={16} height={16} />
        <Typography
          sx={{
            fontSize: '12px',
            color: '#1E1E1E',
            paddingLeft: '4px',
          }}
        >
          {translate('commons.filter_button_label')}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontFamily: 'Cairo',
          fontWeight: 700,
          fontSize: '24px',
        }}
      >
        {translate('message')}
      </Typography>
    </Stack>
  );
}
