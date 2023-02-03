import { noCase } from 'change-case';
import React, { Key, useState, useEffect } from 'react';
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
import {
  subNotification,
  subNotificationClient,
  notifAccManager,
} from 'queries/commons/subNotification';
import { notificationCount } from 'queries/commons/subNotificationCount';
import Page500 from 'pages/Page500';
import { useLocation, useNavigate } from 'react-router';
import axiosInstance from 'utils/axios';
import 'moment/min/locales';
import moment from 'moment';
import { setNotifyCount } from 'redux/slices/notification';
import { useDispatch, useSelector } from 'redux/store';
import { FEATURE_NOTIFICATION_SYSTEM } from 'config';

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
  proposal_id: string;
  appointment_id: string;
  subject: string;
  content: string;
  read_status: boolean;
  created_at: Date;
  type: string;
  proposal: {
    id: string;
    inner_status: string;
    outter_status: string;
    state: string;
    payments: [
      {
        id: string;
        payment_date: string;
        status: string;
        cheques: [
          {
            transfer_receipt: string;
            id: string;
          }
        ];
      }
    ];
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
  const dispatch = useDispatch();

  const { notifyCount } = useSelector((state) => state.notification);
  const { translate, currentLang } = useLocales();

  const [activeTap, setActiveTap] = useState('1');

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const [currentNotifCount, setCurrentNotifCount] = useState<number>(0);

  const [totalUnRead, setTotalUnRead] = useState<number>(0);

  const [totalUnReadToday, setTotalUnReadToday] = useState<number>(0);

  const [totalUnReadPrevious, setTotalUnReadPrevious] = useState<number>(0);

  const [totalToday, setTotalToday] = useState<NotificationItemProps[] | []>([]);

  const [totalPrevious, setTotalPrevious] = useState<NotificationItemProps[] | []>([]);

  const [currentData, setCurrentData] = useState<NotificationItemProps[] | []>([]);

  const [openAlert, setOpenAlert] = useState(false);

  const { user, activeRole } = useAuth();

  const userId = user?.id;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  let currentSubcription: any;

  const empNotifications = {
    query: subNotification,
    variables: { user_id: userId },
  };

  const clientNotifications = {
    query: subNotificationClient,
    variables: { user_id: userId },
  };

  const accManagerNotifications = {
    query: notifAccManager,
    variables: { user_id: userId },
  };

  if (activeRole === 'tender_client' || activeRole === 'tender_project_supervisor') {
    currentSubcription = clientNotifications;
  } else if (activeRole === 'tender_accounts_manager') {
    currentSubcription = accManagerNotifications;
  } else {
    currentSubcription = empNotifications;
  }

  const [notifCount] = useSubscription({
    query: notificationCount,
    variables: { user_id: userId },
  });

  // const [result] = useSubscription(currentSubcription);

  // const { data, fetching, error } = result;
  const { data: dataNotifCount, fetching: fetchingNotifCount, error: NotifCountError } = notifCount;

  // if (!fetchingNotifCount && dataNotifCount) {
  //   console.log(dataNotifCount);
  //   setCurrentNotifCount(dataNotifCount.notification_aggregate.aggregate.count);
  // }

  // if (!fetching && data) {
  //   console.log(data.notification);
  // setCurrentData(data.notification);
  // }

  useEffect(() => {
    // if(FEATURE_NOTIFICATION_SYSTEM){
    if (!fetchingNotifCount && dataNotifCount) {
      dispatch(setNotifyCount(dataNotifCount));
      console.log(notifyCount, 'COUNT SUBSCRIPTION');
    }

    // if (!fetching && data) {
    // console.log(data.notification);
    // setCurrentData(data.notification);
    // }
    // }
  }, [dataNotifCount, fetchingNotifCount, dispatch, notifyCount]);

  // console.log(notifyCount, 'COUNT DARI REDUX');

  // const handleClose = () => {
  //   setOpen(null);
  // };

  // const handleMarkAllAsRead = async () => {
  //   await axiosInstance.patch(
  //     'tender/notification/read-mine',
  //     {},
  //     {
  //       headers: { 'x-hasura-role': activeRole! },
  //     }
  //   );
  // };

  // const handleClearAll = async () => {
  //   await axiosInstance.patch(
  //     'tender/notification/hide-all-mine',
  //     {},
  //     {
  //       headers: { 'x-hasura-role': activeRole! },
  //     }
  //   );
  // };

  // const handleTapChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setActiveTap(newValue);
  // };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  if (NotifCountError) {
    setOpenAlert(true);
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const oneDayAgo = Date.now() - oneDay;

  // if (currentData.length) {
  //   const totalUnRead1 = currentData.filter((item: any) => item.read_status === false).length;
  //   setTotalUnRead(totalUnRead1);
  //   console.log(totalUnRead1, 'TOTAL UN READ');
  // setTotalUnReadToday(
  //   currentData?.filter((item: any) => {
  //     const createdAt = new Date(item.created_at);
  //     if (createdAt.getTime() >= oneDayAgo) {
  //       return item.read_status === false;
  //     }
  //   }).length
  // );
  // const totalUnReadToday = currentData?.notification?.filter((item: any) => {
  //   const createdAt = new Date(item.created_at);
  //   if (createdAt.getTime() >= oneDayAgo) {
  //     return item.read_status === false;
  //   }
  // }).length;
  // setTotalUnReadPrevious(
  //   currentData.filter((item: any) => {
  //     const createdAt = new Date(item.created_at);
  //     if (createdAt.getTime() < oneDayAgo) {
  //       return item.read_status === false;
  //     }
  //   }).length
  // );
  // const totalUnReadPrevious = data?.notification?.filter((item: any) => {
  //   const createdAt = new Date(item.created_at);
  //   if (createdAt.getTime() < oneDayAgo) {
  //     return item.read_status === false;
  //   }
  // }).length;
  // setTotalToday(
  //   currentData?.filter((item: any) => {
  //     const createdAt = new Date(item.created_at);
  //     if (createdAt.getTime() >= oneDayAgo) {
  //       return item;
  //     }
  //   })
  // );
  // const totalToday = currentData?.notification?.filter((item: any) => {
  //   const createdAt = new Date(item.created_at);
  //   if (createdAt.getTime() >= oneDayAgo) {
  //     return item;
  //   }
  // });
  // const totalPrevious = currentData?.notification?.filter((item: any) => {
  //   const createdAt = new Date(item.created_at);
  //   if (createdAt.getTime() < oneDayAgo) {
  //     return item;
  //   }
  // });
  // }

  return (
    <>
      {/* <IconButtonAnimate disabled={!FEATURE_NOTIFICATION_SYSTEM} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        {!fetchingNotifCount && dataNotifCount ? (
          <React.Fragment>
            {currentNotifCount > 0 ? (
              <Badge badgeContent={currentNotifCount} color="primary">
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
          </React.Fragment>
        ) : (
          <React.Fragment>...loading!</React.Fragment>
        )}
      </IconButtonAnimate> */}

      {/* <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert severity="error" onClose={handleCloseAlert} sx={{ width: '100%' }}>
          ...Opss, in notification popover component something went wrong
        </Alert>
      </Snackbar>
      <IconButtonAnimate disabled={!FEATURE_NOTIFICATION_SYSTEM} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        {currentNotifCount && currentNotifCount > 0 ? (
          <Badge badgeContent={currentNotifCount} color="primary">
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

            <Box>
              <Typography variant="subtitle1">{translate('notification.header')}</Typography>
              <TabList
                value={activeTap}
                onChange={handleTapChange}
                // aria-label="lab API tabs example"
              >
                <Tab
                  label={
                    <>
                      <Box>
                        {translate('notification.today')}
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
                        {translate('notification.previous')}
                        {currentNotifCount && currentNotifCount > 0 && (
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
                            {currentNotifCount}
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
              {currentNotifCount && currentNotifCount > 0 && (
                <>
                  <IconButton color="primary" onClick={handleMarkAllAsRead}>
                    <Iconify icon="eva:done-all-fill" width={20} height={20} />
                    <Typography sx={{ ml: 0.5 }}>{translate('notification.read_all')}</Typography>
                  </IconButton>
                </>
              )}

              <IconButton color="error" onClick={handleClearAll}>
                <Typography sx={{ ml: 0.5 }}>{translate('notification.clear_all')}</Typography>
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', mb: '10px' }} />
          <TabPanel value="1" sx={{ maxHeight: 350, overflowY: 'auto' }}>
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              <List disablePadding>
                <>
                  {currentData && currentData?.notification && totalToday?.length > 0 ? (
                    <>
                      {currentData &&
                        currentData.notification.map((item: NotificationItemProps, index: any) => (
                          <NotificationItem
                            key={index}
                            notification={item}
                            tabValue={activeTap}
                            onClose={handleClose}
                          />
                        ))}
                    </>
                  ) : (
                    <ListItemButton
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        mt: '1px',
                      }}
                    >
                      <ListItemText primary={translate(`notification.no_notifications_today`)} />
                    </ListItemButton>
                  )}
                </>
              </List>
            </Scrollbar>

            <Divider sx={{ borderStyle: 'dashed' }} />
          </TabPanel>
          <TabPanel value="2" sx={{ maxHeight: 350, overflowY: 'auto' }}>
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              <List disablePadding>
                <>
                  {currentData && currentData?.notification && totalPrevious.length > 0 ? (
                    <>
                      {currentData &&
                        currentData.notification.map((item: NotificationItemProps, index: any) => (
                          <NotificationItem
                            key={index}
                            notification={item}
                            tabValue={activeTap}
                            onClose={handleClose}
                          />
                        ))}
                    </>
                  ) : (
                    <ListItemButton
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        mt: '1px',
                      }}
                    >
                      <ListItemText primary={translate(`notification.no_notifications`)} />
                    </ListItemButton>
                  )}
                </>
              </List>
            </Scrollbar>
          </TabPanel>
        </TabContext>
      </MenuPopover> */}
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({
  notification,
  tabValue,
  onClose,
}: {
  notification: NotificationItemProps;
  tabValue: any;
  onClose: () => void;
}) {
  // const { description } = renderContent(notification);
  const { translate, currentLang } = useLocales();

  const navigate = useNavigate();
  const location = useLocation();

  const { activeRole } = useAuth();

  // const valueLocale = localStorage.getItem('i18nextLng');

  const oneDay = 24 * 60 * 60 * 1000;

  const oneDayAgo = Date.now() - oneDay;

  const createdAt = new Date(notification.created_at);

  const fiveMinSoon = 5 * 60 * 1000;
  // const createdAtMeeting = new Date(data?.appointment?.created_at);
  // const getTimeMeeting = Date.now() - createdAtMeeting.getTime();

  const getTimeMeeting = (createdAtMeeting: any) => Date.now() - createdAtMeeting.getTime();

  const handleNavigateProject = async (
    proposalId: string,
    notificationId: string,
    innerStatus: string,
    outterStatus: string,
    state: string
  ) => {
    await axiosInstance.patch(
      'tender/notification/read',
      {
        notificationId: notificationId,
      },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
    const prefixRole = activeRole && activeRole.substring(0, 7);

    const newActiveRole =
      prefixRole && activeRole && activeRole.replace(prefixRole, '').toUpperCase();

    let footer_action = '';
    let request_action = '';
    if (activeRole === 'tender_ceo') {
      footer_action = 'show-details';
      request_action = 'project-management';
    } else if (
      activeRole !== 'tender_client' &&
      state === newActiveRole &&
      outterStatus === 'ONGOING'
    ) {
      footer_action = 'show-details';
      request_action = 'requests-in-process';
    } else {
      footer_action = 'show-project';
      request_action = 'previous-funding-requests';
    }

    onClose();

    const x = location.pathname.split('/');
    navigate(`/${x[1] + '/' + x[2]}/${request_action}/${proposalId}/${footer_action}`);
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

    onClose();

    const x = location.pathname.split('/');
    navigate(`/${x[1] + '/' + x[2]}/appointments`);
  };

  const subject = (value: any) => {
    let tempSubject = '';
    if (value === 'Proposal accepted Notification') {
      tempSubject = 'notification.proposal_accepted';
    } else if (value === 'Proposal rejected Notification') {
      tempSubject = 'notification.proposal_rejected';
    } else if (value === 'Proposal reviewed Notification') {
      tempSubject = 'notification.proposal_reviewed';
    } else if (value === "Tender's New Appointment") {
      tempSubject = 'notification.tender_appointment';
    } else {
      tempSubject = value;
    }
    return tempSubject;
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
                primary={translate(`${subject(notification.subject)}`)}
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
                      {moment(notification.created_at).locale(`${currentLang.value}`).fromNow()}
                    </Typography>
                    <Stack direction="row" justifyContent="start">
                      {notification.type === 'PROPOSAL' && (
                        <Button
                          style={{ textAlign: 'start', color: 'green' }}
                          onClick={() =>
                            handleNavigateProject(
                              notification.proposal_id,
                              notification.id,
                              notification?.proposal?.inner_status,
                              notification?.proposal?.outter_status,
                              notification?.proposal?.state
                            )
                          }
                        >
                          {translate('notification.to_project')}
                        </Button>
                      )}
                      {notification.type === 'APPOINTMENT' && (
                        <Button
                          style={{ textAlign: 'start', color: 'blue' }}
                          onClick={() =>
                            handleNavigateAppointment(notification.appointment.id, notification.id)
                          }
                        >
                          {translate('notification.appointment')}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                }
              />
            </ListItemButton>
          )}
          {/* ---------------------------End Project Today Item--------------------------- */}
          {/* ---------------------------Appointment Today Item--------------------------- */}
          {notification?.appointment && getTimeMeeting(notification?.created_at) <= fiveMinSoon && (
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
              }}
            >
              <ListItemText
                primary={translate(`notification.subject_five_min_appointment`)}
                secondary={
                  <Stack direction="column">
                    <Typography>
                      {translate(`notification.content_five_min_appointment`)}
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
                      {moment(notification.created_at).locale(`${currentLang.value}`).fromNow()}
                    </Typography>
                    {notification.type === 'PROPOSAL' && (
                      <Stack direction="row" justifyContent="start">
                        <Button
                          style={{ textAlign: 'start', color: 'green' }}
                          href={notification.appointment.meeting_url}
                          rel="noopened noreferrer"
                          target="_blank"
                        >
                          {translate('notification.join_now')}
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                }
              />
            </ListItemButton>
          )}
          {/* ---------------------------End Appointment Today Item--------------------------- */}
          {/* ---------------------------Payment Today Item--------------------------- */}
          {notification?.proposal && notification.proposal.payments && (
            <>
              {notification.proposal.payments.map((cheque: any, index: any) => (
                <ListItemButton
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    mt: '1px',
                  }}
                  key={index}
                >
                  <ListItemText
                    primary={translate('notification.subject_payment')}
                    secondary={
                      <Stack direction="column">
                        <Typography>{translate('notification.content_payment')}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.disabled',
                          }}
                        >
                          {moment(notification.created_at).locale(`${currentLang.value}`).fromNow()}
                        </Typography>
                        {cheque.cheques.map((item: any, index: any) => (
                          <>
                            <Stack direction="row" justifyContent="start" key={index}>
                              <Button
                                style={{ textAlign: 'start', color: 'blue' }}
                                href={item.transfer_receipt}
                                rel="noopened noreferrer"
                                target="_blank"
                              >
                                {translate(`notification.proof_of_funds`)}
                              </Button>
                            </Stack>
                          </>
                        ))}
                      </Stack>
                    }
                  />
                </ListItemButton>
              ))}
            </>
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
              primary={translate(`${subject(notification.subject)}`)}
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
                    {moment(notification.created_at).locale(`${currentLang.value}`).fromNow()}
                  </Typography>
                  <Stack direction="row" justifyContent="start">
                    {notification.type === 'PROPOSAL' && (
                      <Button
                        style={{ textAlign: 'start', color: 'green' }}
                        onClick={() =>
                          handleNavigateProject(
                            notification.proposal_id,
                            notification.id,
                            notification?.proposal?.inner_status,
                            notification?.proposal?.outter_status,
                            notification?.proposal?.state
                          )
                        }
                      >
                        {translate('notification.to_project')}
                      </Button>
                    )}
                    {notification.type === 'APPOINTMENT' && (
                      <Button
                        style={{ textAlign: 'start', color: 'blue' }}
                        onClick={() =>
                          handleNavigateAppointment(notification.appointment.id, notification.id)
                        }
                      >
                        {translate('notification.appointment')}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              }
            />
          </ListItemButton>
          {/* ---------------------------End Project Previous Item--------------------------- */}
          {/* ---------------------------Appointment Previous Item--------------------------- */}
          {notification?.appointment && (
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
              }}
            >
              <ListItemText
                primary={translate(`notification.subject_five_min_appointment`)}
                secondary={
                  <Stack direction="column">
                    <Typography>
                      {translate(`notification.content_five_min_appointment`)}
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
                      {moment(notification.created_at).locale(`${currentLang.value}`).fromNow()}
                    </Typography>
                    {notification.type === 'APPOINTMENT' && (
                      <Stack direction="row" justifyContent="start">
                        <Button
                          style={{ textAlign: 'start', color: 'green' }}
                          href={notification.appointment.meeting_url}
                          rel="noopened noreferrer"
                          target="_blank"
                        >
                          {translate('notification.join_now')}
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                }
              />
            </ListItemButton>
          )}
          {/* ---------------------------End Appointment Previous Item--------------------------- */}
          {/* ---------------------------Payment Previous Item--------------------------- */}
          {notification?.proposal && notification.proposal.payments && (
            <>
              {notification.proposal.payments.map((cheque: any, index: any) => (
                <ListItemButton
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    mt: '1px',
                  }}
                  key={index}
                >
                  <ListItemText
                    primary={translate('notification.subject_payment')}
                    secondary={
                      <Stack direction="column">
                        <Typography>{translate('notification.content_payment')}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.disabled',
                          }}
                        >
                          {moment(notification.created_at).locale(`${currentLang.value}`).fromNow()}
                        </Typography>
                        {cheque.cheques.map((item: any, index: any) => (
                          <>
                            <Stack direction="row" justifyContent="start" key={index}>
                              <Button
                                style={{ textAlign: 'start', color: 'blue' }}
                                href={item.transfer_receipt}
                                rel="noopened noreferrer"
                                target="_blank"
                              >
                                {translate(`notification.proof_of_funds`)}
                              </Button>
                            </Stack>
                          </>
                        ))}
                      </Stack>
                    }
                  />
                </ListItemButton>
              ))}
            </>
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
