import { Box, Typography, Stack, Button } from '@mui/material';
import SvgIconStyle from 'components/SvgIconStyle';
import { useNavigate } from 'react-router';

export default function AccountPopover() {
  const navigate = useNavigate();
  return (
    <Box
      component={Button}
      onClick={() => {
        navigate('/client/my-profile');
      }}
      sx={{
        alignItems: 'center',
        p: '10px',
        display: 'flex',
        direction: 'row',
        justifyContent: 'left',
        width: '290px',
        height: '50px',
        backgroundColor: 'rgba(147, 163, 176, 0.16)',
        borderRadius: '12px',
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box
          sx={{
            borderRadius: '50%',
            backgroundColor: 'background.paper',
            padding: '8px',
          }}
        >
          <img src="/assets/icons/dashboard-header/account-bar.svg" alt="" />
        </Box>
        <Stack alignItems="start">
          <Typography
            sx={{
              color: 'text.tertiary',
              fontSize: '12px',
            }}
          >
            جمعية الدعوة والإرشاد وتوعية الجاليات
          </Typography>
          <Typography sx={{ color: '#1E1E1E', fontSize: '14px' }}>حساب شريك</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
