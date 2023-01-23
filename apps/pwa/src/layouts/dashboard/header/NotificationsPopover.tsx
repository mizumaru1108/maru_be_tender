/* eslint-disable array-callback-return */
import { noCase } from 'change-case';
import { Key, useState, useEffect } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  Stack,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// utils
import { fToNow } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import SvgIconStyle from 'components/SvgIconStyle';
import { sub } from 'date-fns';
import useLocales from '../../../hooks/useLocales';
import useAuth from 'hooks/useAuth';
import { useSubscription } from 'urql';
import { subNotification, subNotificationClient } from 'queries/commons/subNotification';
import { notificationCount } from 'queries/commons/subNotificationCount';
import Page500 from 'pages/Page500';
import { useLocation, useNavigate } from 'react-router';
import axiosInstance from 'utils/axios';

// ----------------------------------------------------------------------
// const _notifications = [...Array(3)].map((_, index) => ({
//   id: `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
//   description: [
//     'مدير الإدارة قام برفضك مشروعك - #675675',
//     'مشرف المشروع قام بارسال طلب تعديل معلومات لمشروعك الحالي قم بتعديل المعلومات المطلوبة لاكمال المشروع',
//     'مسؤول الحسابات قام بقبول حسابك يمكنك الآن انشاء طلبات دعم',
//   ][index],
//   createdAt: sub(new Date(), { days: index, hours: index }),
//   isUnRead: [true, true, false][index],
//   buttonColor: ['red', 'blue', 'green'][index],
//   buttonText: ['استعراض المشروع', 'تعديل معلومات المشروع', 'انشاء طلب دعم'][index],
// }));

type NotificationItemProps = {
  id: string;
  appointment_id: string;
  subject: string;
  content: string;
  read_status: boolean;
  created_at: Date;
  type: string;
  proposal: {
    id: string;
  };
  appointment: {
    id: string;
    calendar_url: string;
    meeting_url: string;
    client: {
      id: string;
      employee_name: string;
      email: string;
      created_at: string;
      client_data: {
        entity: string;
        authority: string;
      };
    };
  };
};

export default function NotificationsPopover() {
  const { translate } = useLocales();

  const [activeTap, setActiveTap] = useState('1');

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const [openAlert, setOpenAlert] = useState(true);

  const { user, activeRole } = useAuth();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  let currentSubcription: any;

  const [result] = useSubscription({
    query: subNotification,
    variables: { user_id: user?.id },
  });

  const [notifCount] = useSubscription({
    query: notificationCount,
    variables: { user_id: user?.id },
  });

  const [clientNotification] = useSubscription({
    query: subNotificationClient,
    variables: { user_id: user?.id },
  });

  if (activeRole === 'tender_client' || activeRole === 'tender_project_supervisor') {
    currentSubcription = clientNotification;
  } else {
    currentSubcription = result;
  }

  const { data, fetching, error } = currentSubcription;

  useEffect(() => {}, [data]);

  if (fetching) return <>.. Loading</>;

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = async () => {
    await axiosInstance.patch(
      'tender/notification/read-mine',
      {},
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
  };

  const handleClearAll = async () => {
    await axiosInstance.patch(
      'tender/notification/hide-all-mine',
      {},
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
  };

  const handleTapChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTap(newValue);
  };

  const oneDay = 24 * 60 * 60 * 1000;
  const oneDayAgo = Date.now() - oneDay;

  // const totalUnRead = data?.notification?.filter((item: any) => item.read_status === false).length;

  const totalUnReadToday = data?.notification?.filter((item: any) => {
    const createdAt = new Date(item.created_at);

    if (createdAt.getTime() >= oneDayAgo) {
      return item.read_status === false;
    }
  }).length;

  // const totalUnReadPrevious = data?.notification?.filter((item: any) => {
  //   const createdAt = new Date(item.created_at);

  //   if (createdAt.getTime() < oneDayAgo) {
  //     return item.read_status === false;
  //   }
  // }).length;

  const totalToday = data?.notification?.filter((item: any) => {
    const createdAt = new Date(item.created_at);

    if (createdAt.getTime() >= oneDayAgo) {
      return item;
    }
  });

  const totalPrevious = data?.notification?.filter((item: any) => {
    const createdAt = new Date(item.created_at);

    if (createdAt.getTime() < oneDayAgo) {
      return item;
    }
  });

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  if (error) {
    setOpenAlert(true);
  }

  // console.log('RESULT', data);
  // console.log('Subcription', currentSubcription);
  // console.log('ROLE', activeRole);
  // console.log('USER', user?.id);
  // console.log('notif Count', notifCount);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert severity="error" onClose={handleCloseAlert} sx={{ width: '100%' }}>
          ...Opss, in notification popover component something went wrong
        </Alert>
      </Snackbar>
      <IconButtonAnimate onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        {notifCount?.data?.notification_aggregate?.aggregate?.count > 0 ? (
          <Badge
            badgeContent={notifCount?.data?.notification_aggregate?.aggregate?.count}
            color="primary"
          >
            <SvgIconStyle
              src={`/assets/icons/dashboard-header/notification-bar.svg`}
              sx={{ width: 25, height: 25, color: '#000' }}
            />
          </Badge>
        ) : (
          <SvgIconStyle
            src={`/assets/icons/dashboard-header/notification-bar.svg`}
            sx={{ width: 25, height: 25, color: '#000' }}
          />
        )}
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 500, p: 0, mt: 1.5, ml: 0.75, backgroundColor: '#fff' }}
        disabledArrow={true}
      >
        <TabContext value={activeTap}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              // py: 2,
              pt: 2,
              px: 2.5,
            }}
          >
            {/* <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">الإشعارات</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              لديك {totalUnRead} إشعارات غير مقروئة
            </Typography>
          </Box> */}

            <Box>
              <Typography variant="subtitle1">الإشعارات</Typography>
              <TabList
                value={activeTap}
                onChange={handleTapChange}
                // aria-label="lab API tabs example"
              >
                <Tab
                  label={
                    <>
                      <Box>
                        Today
                        {totalUnReadToday > 0 && (
                          <Box
                            component={'span'}
                            sx={{
                              backgroundColor: '#13B2A2',
                              color: '#fff',
                              mx: 1,
                              borderRadius: '100%',
                              px: 1,
                              fontSize: 12,
                            }}
                          >
                            {totalUnReadToday}
                          </Box>
                        )}
                      </Box>
                    </>
                  }
                  value="1"
                />
                <Tab
                  label={
                    <>
                      <Box>
                        Previous
                        {notifCount?.data?.notification_aggregate?.aggregate?.count > 0 && (
                          <Box
                            component={'span'}
                            sx={{
                              backgroundColor: '#13B2A2',
                              color: '#fff',
                              mx: 1,
                              borderRadius: '100%',
                              px: 1,
                              fontSize: 12,
                            }}
                          >
                            {notifCount?.data?.notification_aggregate?.aggregate?.count}
                          </Box>
                        )}
                      </Box>
                    </>
                  }
                  value="2"
                />
              </TabList>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'end',
              }}
            >
              {notifCount?.data?.notification_aggregate?.aggregate?.count > 0 && (
                <>
                  {/* <Tooltip title=" Mark all as read"> */}
                  <IconButton color="primary" onClick={handleMarkAllAsRead}>
                    <Iconify icon="eva:done-all-fill" width={20} height={20} />
                    <Typography sx={{ ml: 0.5 }}>Mark all as read</Typography>
                  </IconButton>
                  {/* </Tooltip> */}
                </>
              )}

              {/* <Tooltip title=" Mark all as read"> */}
              <IconButton color="error" onClick={handleClearAll}>
                <Typography sx={{ ml: 0.5 }}>Clear All</Typography>
              </IconButton>
              {/* </Tooltip> */}
            </Box>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', mb: '10px' }} />
          <TabPanel value="1">
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              <List disablePadding>
                <>
                  {data?.notification && totalToday?.length > 0 ? (
                    <>
                      {data.notification.map(
                        (item: NotificationItemProps, index: Key | null | undefined) => (
                          <NotificationItem key={index} notification={item} tabValue={activeTap} />
                        )
                      )}
                    </>
                  ) : (
                    <ListItemButton
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        mt: '1px',
                      }}
                    >
                      <ListItemText primary="No Notifications Today" />
                    </ListItemButton>
                  )}
                </>
              </List>
            </Scrollbar>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <Box sx={{ p: 1 }}>
              <Button fullWidth disableRipple>
                {translate('view_all')}
              </Button>
            </Box> */}
          </TabPanel>
          <TabPanel value="2" sx={{ maxHeight: 350, overflowY: 'auto' }}>
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              <List disablePadding>
                <>
                  {data?.notification && totalPrevious.length > 0 ? (
                    <>
                      {data.notification.map(
                        (item: NotificationItemProps, index: Key | null | undefined) => (
                          <NotificationItem key={index} notification={item} tabValue={activeTap} />
                        )
                      )}
                    </>
                  ) : (
                    <ListItemButton
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        mt: '1px',
                      }}
                    >
                      <ListItemText primary="No Notifications" />
                    </ListItemButton>
                  )}
                </>
              </List>
            </Scrollbar>

            {/* <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1 }}>
              <Button fullWidth disableRipple>
                {translate('view_all')}
              </Button>
            </Box> */}
          </TabPanel>
        </TabContext>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({
  notification,
  tabValue,
}: {
  notification: NotificationItemProps;
  tabValue: any;
}) {
  // const { description } = renderContent(notification);

  const navigate = useNavigate();
  const location = useLocation();

  const { activeRole } = useAuth();

  const oneDay = 24 * 60 * 60 * 1000;

  const oneDayAgo = Date.now() - oneDay;

  const createdAt = new Date(notification.created_at);

  const fiveMinSoon = 5 * 60 * 1000;
  // const createdAtMeeting = new Date(data?.appointment?.created_at);
  // const getTimeMeeting = Date.now() - createdAtMeeting.getTime();

  const getTimeMeeting = (createdAtMeeting: any) => Date.now() - createdAtMeeting.getTime();

  const handleNavigateProject = async (id: string, notificationId: string) => {
    await axiosInstance.patch(
      'tender/notification/read',
      {
        notificationId: notificationId,
      },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );

    const x = location.pathname.split('/');
    navigate(`/${x[1] + '/' + x[2]}/previous-funding-requests/${id}/show-details`);
  };

  const handleNavigateAppointment = async (id: string, notificationId: string) => {
    await axiosInstance.patch(
      'tender/notification/read',
      {
        notificationId: notificationId,
      },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );

    const x = location.pathname.split('/');
    navigate(`/${x[1] + '/' + x[2]}/appointments`);
  };

  return (
    <>
      {tabValue === '1' ? (
        <>
          {/* ---------------------------Project Today Item--------------------------- */}
          {createdAt.getTime() >= oneDayAgo && (
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(notification.read_status && {
                  bgcolor: 'action.selected',
                }),
              }}
            >
              <ListItemText
                primary={notification.subject}
                secondary={
                  <Stack direction="column">
                    <Typography>{notification.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      {fToNow(notification.created_at)}
                    </Typography>
                    <Stack direction="row" justifyContent="start">
                      {notification.type === 'PROPOSAL' && (
                        <Button
                          style={{ textAlign: 'start', color: 'green' }}
                          onClick={() =>
                            handleNavigateProject(notification.proposal.id, notification.id)
                          }
                        >
                          Go to Project
                        </Button>
                      )}
                      {notification.type === 'APPOINTMENT' && (
                        <Button
                          style={{ textAlign: 'start', color: 'blue' }}
                          onClick={() =>
                            handleNavigateAppointment(notification.appointment.id, notification.id)
                          }
                        >
                          See the Appointment
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                }
              />
            </ListItemButton>
          )}
          {/* ---------------------------End Project Today Item--------------------------- */}
          {notification?.appointment && getTimeMeeting(notification?.created_at) <= fiveMinSoon && (
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
              }}
            >
              <ListItemText
                primary={'Your appointment will starting soon!'}
                secondary={
                  <Stack direction="column">
                    <Typography>
                      {'This meeting will last 5 minutes, you can join the meeting now'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      {fToNow(notification.created_at)}
                    </Typography>
                    {notification.type === 'PROPOSAL' && (
                      <Stack direction="row" justifyContent="start">
                        <Button
                          style={{ textAlign: 'start', color: 'green' }}
                          onClick={() => navigate(notification.appointment.meeting_url)}
                        >
                          Join Now
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                }
              />
            </ListItemButton>
          )}
        </>
      ) : (
        <>
          {/* --------------------------- Project Previous Item--------------------------- */}
          <ListItemButton
            sx={{
              py: 1.5,
              px: 2.5,
              mt: '1px',
              ...(notification.read_status && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            <ListItemText
              primary={notification.subject}
              secondary={
                <Stack direction="column">
                  <Typography>{notification.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {fToNow(notification.created_at)}
                  </Typography>
                  <Stack direction="row" justifyContent="start">
                    {notification.type === 'PROPOSAL' && (
                      <Button
                        style={{ textAlign: 'start', color: 'green' }}
                        onClick={() =>
                          handleNavigateProject(notification.proposal.id, notification.id)
                        }
                      >
                        Go to Project
                      </Button>
                    )}
                    {notification.type === 'APPOINTMENT' && (
                      <Button
                        style={{ textAlign: 'start', color: 'blue' }}
                        onClick={() =>
                          handleNavigateAppointment(notification.appointment.id, notification.id)
                        }
                      >
                        See the Appointment
                      </Button>
                    )}
                  </Stack>
                </Stack>
              }
            />
          </ListItemButton>
          {/* ---------------------------End Project Previous Item--------------------------- */}
          {notification?.appointment && (
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
              }}
            >
              <ListItemText
                primary={'Your appointment will starting soon!'}
                secondary={
                  <Stack direction="column">
                    <Typography>
                      {'This meeting will last 5 minutes, you can join the meeting now'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      {fToNow(notification.created_at)}
                    </Typography>
                    {notification.type === 'APPOINTMENT' && (
                      <Stack direction="row" justifyContent="start">
                        <Button
                          style={{ textAlign: 'start', color: 'green' }}
                          onClick={() => navigate(notification.appointment.meeting_url)}
                        >
                          Join Now
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                }
              />
            </ListItemButton>
          )}
        </>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const description = (
    <Typography variant="subtitle2">
      {/* {notification.description} */}
      {/* <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography> */}
    </Typography>
  );

  // if (notification.type === 'order_placed') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_package.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  // if (notification.type === 'order_shipped') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_shipping.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  // if (notification.type === 'mail') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_mail.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  // if (notification.type === 'chat_message') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_chat.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  return {
    description,
  };
}
