import { Box, Button, Stack, Typography } from '@mui/material';
import useResponsive from 'hooks/useResponsive';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../@types/commons';
import { Role } from '../../../guards/RoleBasedGuard';
import useAuth from '../../../hooks/useAuth';

export default function AccountPopover() {
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as Role;

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
                {/* جمعية الدعوة والإرشاد وتوعية الجاليات */}
                {role_url_map[`${role}`] ?? 'User Roles'}
              </Typography>
              <Typography sx={{ color: '#1E1E1E', fontSize: '14px' }}>
                {/* حساب شريك */}
                {user?.fullName ?? "User's name"}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}
