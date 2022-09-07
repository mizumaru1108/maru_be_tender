import { Box, Typography, Stack, Button } from '@mui/material';
import SvgIconStyle from 'components/SvgIconStyle';

export default function AccountPopover() {
  return (
    <Box
      component={Button}
      onClick={() => {
        console.log('navigate to the profile page');
      }}
      sx={{
        alignItems: 'center',
        display: 'flex',
        direction: 'row',
        justifyContent: 'left',
        width: '290px',
        height: '60px',
        backgroundColor: 'rgba(147, 163, 176, 0.16)',
        borderRadius: 1,
        '&:hover': {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box
          sx={{
            borderRadius: '50%',
            borderStyle: 'solid',
            width: '56px',
            height: '56px',
            textAlign: 'center',
            backgroundColor: 'background.paper',
            padding: '10px',
          }}
        >
          <SvgIconStyle
            src={`/assets/icons/dashboard-header/account-bar.svg`}
            sx={{ width: 1, height: 1, color: '#fff' }}
          />
        </Box>
        <Stack alignItems="start">
          <Typography
            sx={{
              mt: '5px',
              color: 'text.tertiary',
              fontFamily: 'Cairo',
              fontStyle: 'Bold',
              fontSize: '12px',
            }}
          >
            جمعية الدعوة والإرشاد وتوعية الجاليات
          </Typography>
          <Typography
            sx={{ color: '#1E1E1E', fontFamily: 'Cairo', fontStyle: 'Regular', fontSize: '14px' }}
          >
            حساب شريك
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
