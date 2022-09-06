import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import SvgIconStyle from 'components/SvgIconStyle';
// import {ReactComponent as AccountBar} from 'assets/icons/dashboard-header/account-bar.svg'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_DASHBOARD.user.profile,
  },
  {
    label: 'Settings',
    linkTo: PATH_DASHBOARD.user.account,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    textAlign: 'right',
    color: '#0E8478',
    fontFamily: 'Cairo',
    fontStyle: 'Bold',
    fontSize: '15px',
  }));
  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: '16px',
          width: '336px',
          height: '72px',
          backgroundColor: 'background.default',
          borderRadius: 1,
        }}
      >
        <Stack direction="row" spacing={2}>
          <Box
            sx={{
              borderRadius: '50%',
              borderStyle: 'solid',
              width: '56px',
              height: '56px',
              backgroundColor: 'background.paper',
              textAlign: 'center',
              padding: 1,
            }}
          >
            <SvgIconStyle
              src={`/assets/icons/dashboard-header/account-bar.svg`}
              sx={{ width: 1, height: 1 }}
            />
          </Box>
          <Stack alignItems="start">
            <Item sx={{ mt: '5px', color: 'text.secondary' }}>
              جمعية الدعوة والإرشاد وتوعية الجاليات
            </Item>
            <Item sx={{ color: '#93A3B0' }}>حساب شريك</Item>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
