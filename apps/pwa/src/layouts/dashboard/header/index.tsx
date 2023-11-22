// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar } from '@mui/material';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { HEADER, NAVBAR } from '../../../config';
// components
import Iconify from '../../../components/Iconify';
import { IconButtonAnimate } from '../../../components/animate';
//
import Searchbar from './SearchbarV3_2_0';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import MessagePopover from './MessagePopover';
import SwitchRole from './SwitchRole';
import useAuth from 'hooks/useAuth';

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout: boolean;
};

// ----------------------------------------------------------------------

type Props = {
  onOpenSidebar: VoidFunction;
  isCollapse?: boolean;
  verticalLayout?: boolean;
};

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  verticalLayout = false,
}: Props) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive('up', 'lg');

  const { activeRole } = useAuth();

  const RootStyle = styled(AppBar, {
    shouldForwardProp: (prop) =>
      prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
  })<RootStyleProps>(({ isCollapse, isOffset, verticalLayout, theme }) => ({
    ...cssStyles(theme).bgBlur(),
    boxShadow: 'none',
    height: activeRole !== 'tender_client' ? HEADER.MOBILE_HEIGHT * 2 : HEADER.MOBILE_HEIGHT,
    zIndex: theme.zIndex.appBar + 1,
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('md')]: {
      height: HEADER.MOBILE_HEIGHT,
    },
    [theme.breakpoints.up('lg')]: {
      height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
      width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
      ...(isCollapse && {
        width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
      }),
      ...(isOffset && {
        height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      }),
      backgroundColor: theme.palette.background.default,
    },
  }));

  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
        }}
      >
        {activeRole !== 'tender_client' ? (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 0 }}
            component="div"
            justifyContent={{ md: 'space-between' }}
            sx={{ width: '100%' }}
          >
            <Stack
              component="div"
              direction="row"
              alignItems="center"
              spacing={{ xs: 0.5, sm: 1.5 }}
            >
              {!isDesktop && (
                <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                  <Iconify icon="eva:menu-2-fill" />
                </IconButtonAnimate>
              )}
              {isDesktop ? (
                <Searchbar />
              ) : (
                <>
                  <Box sx={{ flexGrow: 1 }} />
                  <AccountPopover />
                  <SwitchRole />
                </>
              )}
            </Stack>
            <Stack
              component="div"
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={{ xs: 0.5, sm: 1.5 }}
              sx={{ mt: '4px !important' }}
            >
              {!isDesktop ? (
                <>
                  <Searchbar />
                  <Box sx={{ flexGrow: 1 }} />
                </>
              ) : (
                <>
                  <Box sx={{ flexGrow: 1 }} />
                  <AccountPopover />
                  <SwitchRole />
                </>
              )}
              <MessagePopover />
              <NotificationsPopover />
              <LanguagePopover />
            </Stack>
          </Stack>
        ) : (
          <>
            {!isDesktop && (
              <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <Iconify icon="eva:menu-2-fill" />
              </IconButtonAnimate>
            )}

            <Searchbar />
            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
              <AccountPopover />
              <MessagePopover />
              <NotificationsPopover />
              <LanguagePopover />
            </Stack>
          </>
        )}
      </Toolbar>
    </RootStyle>
  );
}
