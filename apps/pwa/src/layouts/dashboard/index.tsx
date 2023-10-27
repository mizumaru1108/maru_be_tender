import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import useAuth from 'hooks/useAuth';
// config
import { HEADER, NAVBAR, FEATURE_MESSAGING_SYSTEM } from 'config';
//
import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import CheakClientActivation from 'guards/CheakClientActivation';
// urql + subscription
import { useSubscription } from 'urql';
import { getListConversations } from 'queries/messages/getListConversations';
// redux
import { setConversation } from 'redux/slices/wschat';
import { useDispatch } from 'redux/store';

// ----------------------------------------------------------------------

type MainStyleProps = {
  collapseClick?: boolean;
};

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<MainStyleProps>(({ collapseClick, theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { isCollapse } = useCollapseDrawer();

  const { themeLayout } = useSettings();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);

  const verticalLayout = themeLayout === 'vertical';

  const { user } = useAuth();

  const location = useLocation();
  const urlArr: string[] = location.pathname.split('/');
  // console.log('urlArr', urlArr);

  // urql + subscription
  const [resultConversation] = useSubscription({
    query: getListConversations,
    variables: { user_id: user?.id },
  });
  const { data, fetching, error } = resultConversation;

  // redux messages
  const dispatch = useDispatch();

  useEffect(() => {
    if (FEATURE_MESSAGING_SYSTEM) {
      if (!fetching && data) {
        const { room_chat } = data;

        const newArr = room_chat.map((el: any) => ({
          id: el.id,
          correspondance_category_id: el.correspondance_category_id,
          messages: el.messages,
          unread_message: el.messages_aggregate.aggregate.count,
        }));

        dispatch(setConversation(newArr));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fetching]);

  if (verticalLayout) {
    return (
      <>
        <DashboardHeader onOpenSidebar={() => setOpen(true)} verticalLayout={verticalLayout} />

        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        )}

        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
        </Box>
      </>
    );
  }
  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader
        isCollapse={isCollapse}
        onOpenSidebar={() => {
          setOpen(true);
        }}
      />

      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle>
        {/* <CheakClientActivation>
          <Outlet />
        </CheakClientActivation> */}
        {urlArr.includes('messages') ||
        urlArr.includes('my-profile') ||
        urlArr.includes('show-details') ? (
          <Outlet />
        ) : (
          <CheakClientActivation>
            <Outlet />
          </CheakClientActivation>
        )}
      </MainStyle>
    </Box>
  );
}
