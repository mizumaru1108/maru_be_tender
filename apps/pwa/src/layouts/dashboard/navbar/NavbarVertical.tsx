import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer, Typography, Button } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { NAVBAR } from '../../../config';
// components
import Scrollbar from '../../../components/Scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
//
import navConfig from './NavConfig';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// redux
import { useDispatch } from 'redux/store';
import { setConversation, setMessageGrouped, setActiveConversationId } from 'redux/slices/wschat';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();
  const { logout, activeRole } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'lg');

  // redux
  const dispatch = useDispatch();

  const role = activeRole!;
  const { isCollapse, collapseClick, collapseHover, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack
        sx={{
          pt: 1,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          alignItems: 'center',
        }}
      >
        <Logo />
      </Stack>

      <NavSectionVertical navConfig={navConfig[`${role}`]} isCollapse={isCollapse} />

      <Box sx={{ flexGrow: 1 }} />
      <Box
        component={Button}
        sx={{
          mx: '15px',
          mb: '10px',
          backgroundColor: '#FF484229! important',
          display: 'inline-block',
        }}
        onClick={() => {
          dispatch(setActiveConversationId(null));
          dispatch(setConversation([]));
          dispatch(setMessageGrouped([]));
          logout();
          navigate('/auth/login');
        }}
      >
        <Stack direction="row" gap={2}>
          <img src="/assets/icons/dashboard-navbar/log-out-icon.svg" alt="" />
          <Typography color="#FF4842">{translate('sign_out')}</Typography>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH, backgroundColor: '#fff' } }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
