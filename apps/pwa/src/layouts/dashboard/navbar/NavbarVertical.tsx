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
// import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { ReactComponent as Logo } from '../../../assets/new_logo.svg';
//
import navConfig from './NavConfig';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// redux
import { useDispatch } from 'redux/store';
import { setConversation, setMessageGrouped, setActiveConversationId } from 'redux/slices/wschat';
import { setFiltered } from 'redux/slices/searching';

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
  const { translate, onChangeLang } = useLocales();
  const { logout, activeRole } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'lg');
  // const { onChangeLang } = useLocales();

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
      <Button
        color="error"
        variant="outlined"
        sx={{
          mx: '15px',
          mb: '15px',
          mt: { xs: '10px', sm: 0 },
          backgroundColor: '#FF484229! important',
          justifyContent: 'flex-start',
          gap: '8px',
        }}
        onClick={() => {
          localStorage.removeItem('partnerMeetingId');
          localStorage.removeItem('authCodeMeeting');
          localStorage.removeItem('valueStartDate');
          localStorage.removeItem('valueEndDate');

          localStorage.removeItem('filter_project_name');
          localStorage.removeItem('filter_client_name');
          localStorage.removeItem('filter_project_status');
          localStorage.removeItem('filter_project_track');
          localStorage.removeItem('filter_sorting_field');
          localStorage.removeItem('filter_sort');
          localStorage.removeItem('filter_range_end_date');
          localStorage.removeItem('filter_range_start_date');

          dispatch(setFiltered(''));
          dispatch(setActiveConversationId(null));
          dispatch(setConversation([]));
          dispatch(setMessageGrouped([]));
          onChangeLang('ar');
          logout();
          // navigate(0);
          navigate('/auth/login');
        }}
        startIcon={<img src="/assets/icons/dashboard-navbar/log-out-icon.svg" alt="" />}
      >
        <Typography>{translate('sign_out')}</Typography>
      </Button>
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
