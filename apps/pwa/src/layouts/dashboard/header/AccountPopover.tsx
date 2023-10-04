import { Box, Button, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import useResponsive from 'hooks/useResponsive';
import { useNavigate } from 'react-router';
import { stringTruncate } from 'utils/stringTruncate';
import { role_url_map } from '../../../@types/commons';

import useAuth from '../../../hooks/useAuth';

export default function AccountPopover() {
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const { user, activeRole } = useAuth();
  const role = activeRole!;
  const { translate } = useLocales();
  return (
    <>
      {isMobile ? (
        <Box
          sx={{
            borderRadius: '50%',
            backgroundColor: 'background.paper',
            padding: '8px',
          }}
          component={Button}
          onClick={() => {
            navigate(`/${role_url_map[`${role}`]}/my-profile`);
          }}
        >
          <img src="/assets/icons/dashboard-header/account-bar.svg" alt="" />
        </Box>
      ) : (
        <Box
          component={Button}
          onClick={() => {
            navigate(`/${role_url_map[`${role}`]}/my-profile`);
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
            ':hover': { backgroundColor: 'rgba(147, 220, 176, 0.16)' },
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
                {stringTruncate(user?.firstName, 31)}
              </Typography>
              <Typography sx={{ color: '#1E1E1E', fontSize: '14px' }}>{translate(role)}</Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}
