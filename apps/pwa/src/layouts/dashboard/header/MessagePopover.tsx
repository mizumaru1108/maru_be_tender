import React, { useEffect, useState } from 'react';
// @mui
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Snackbar,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
// utils
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SvgIconStyle from 'components/SvgIconStyle';
import { FEATURE_NOTIFICATION_SYSTEM } from 'config';
import { sub } from 'date-fns';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import {
  notifAccManager,
  subNotification,
  subNotificationClient,
} from 'queries/commons/subNotification';
import { useSubscription } from 'urql';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
import Scrollbar from '../../../components/Scrollbar';
import useLocales from '../../../hooks/useLocales';
import { messageNotificationCount } from '../../../queries/commons/subMessageNotificationCount';
import { setMessageNotifyCount } from '../../../redux/slices/notification';
import { dispatch, useDispatch, useSelector } from '../../../redux/store';
import axiosInstance from '../../../utils/axios';
import { useLocation, useNavigate } from 'react-router';
import { setActiveConversationId } from '../../../redux/slices/wschat';

// ----------------------------------------------------------------------
const _messages = [...Array(2)].map((_, index) => ({
  id: `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  data: [
    'تم ارسال طلب تعديل بينات الحساب البنكي الرجاء التاكد من صحة البيانات المدخلة',
    'تم ارسال طلب تعديل مخرجات المشروع النواتج الرجاء جعل اطار عمل المشروع و نتائجه اكبر ليناسب سياسة الشركة',
  ][index],
  createdAt: sub(new Date(), { days: index, hours: index }),
  isUnRead: [true, false][index],
  senderName: ['مشرف المشروع', 'مسؤول الفرز'][index],
}));

type NotificationItemProps = {
  id: string;
  subject: string;
  content: string;
  read_status: boolean;
  created_at: Date;
  specific_type: string;
  message: {
    id: string;
    content_type_id: number;
    content_title: string;
    content: string;
    created_at: Date;
    attachment: string;
    room_id: string;
    read_status: boolean;
    sender: {
      email: string;
    };
  };
  proposal: {
    id: string;
  };
  // appointment: {
  //   id: string;
  //   calendar_url: string;
  //   meeting_url: string;
  //   client: {
  //     id: string;
  //     employee_name: string;
  //     email: string;
  //     created_at: string;
  //     client_data: {
  //       entity: string;
  //       authority: string;
  //     };
  //   };
  // };
};

export default function MessagePopover() {
  const dispatch = useDispatch();

  const { messageNotifyCount } = useSelector((state) => state.notification);

  const { translate } = useLocales();
  const [messages, setMessages] = useState(_messages);

  const [currentData, setCurrentData] = useState<NotificationItemProps[] | []>([]);

  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [activeTap, setActiveTap] = useState('1');

  const [openAlert, setOpenAlert] = useState(false);

  const { user, activeRole } = useAuth();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  let currentSubcription: any;

  const empNotifications = {
    query: subNotification,
    variables: { user_id: user?.id },
  };

  const clientNotifications = {
    query: subNotificationClient,
    variables: { user_id: user?.id },
  };

  const accManagerNotifications = {
    query: notifAccManager,
    variables: { user_id: user?.id },
  };

  if (activeRole === 'tender_client' || activeRole === 'tender_project_supervisor') {
    currentSubcription = clientNotifications;
  } else if (activeRole === 'tender_accounts_manager') {
    currentSubcription = accManagerNotifications;
  } else {
    currentSubcription = empNotifications;
  }

  const [notifCount] = useSubscription({
    query: messageNotificationCount,
    variables: { user_id: user?.id },
  });

  const [result] = useSubscription(currentSubcription);

  const { data, fetching, error } = result;
  const { data: dataNotifCount, fetching: fetchingNotifCount, error: NotifCountError } = notifCount;

  const memoResult = React.useMemo(() => data, [data]);
  const memoResultError = React.useMemo(() => error, [error]);
  const memoNotifCount = React.useMemo(() => dataNotifCount, [dataNotifCount]);

  useEffect(() => {
    if (FEATURE_NOTIFICATION_SYSTEM) {
      if (!fetching && memoNotifCount) {
        dispatch(setMessageNotifyCount(memoNotifCount.notification_aggregate.aggregate.count));
      }
      // dispatch(setNotifyCount(memoNotifCount.notification_aggregate.aggregate.count));

      if (!fetching && memoResult) {
        const filteredData = memoResult.notification
          .filter((item: NotificationItemProps) => item.specific_type === 'NEW_MESSAGE')
          .map((item: NotificationItemProps) => item);
        setCurrentData(memoResult.notification);
      }
    }
  }, [dispatch, data, currentData, fetching, memoResult, memoNotifCount, memoResultError]);

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = async () => {
    await axiosInstance.patch(
      'tender/notification/read-mine',
      { type: 'message' },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
  };

  const handleTapChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTap(newValue);
  };

  // const handleClearAll = () => {};
  const handleClearAll = async () => {
    await axiosInstance.patch(
      'tender/notification/delete-all-mine',
      { type: 'message' },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
  };

  // if (fetching) return <>.. Loading</>;

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // if (error) {
  //   setOpenAlert(true);
  // }

  const oneDay = 24 * 60 * 60 * 1000;
  const oneDayAgo = Date.now() - oneDay;

  const totalUnRead = React.useMemo(() => {
    if (!currentData) return 0;

    return currentData?.filter((item: any) => item?.message?.read_status === false).length;
  }, [currentData]);

  const totalUnReadToday = React.useMemo(() => {
    const filteredData = currentData
      .filter((item: NotificationItemProps) => item.specific_type === 'NEW_MESSAGE')
      .map((item: NotificationItemProps) => item);
    if (!filteredData) return 0;

    return filteredData.filter((item: any) => {
      const createdAt = new Date(item.created_at);
      if (createdAt.getTime() >= oneDayAgo) {
        return item.read_status === false;
      }
      return false;
    }).length;
  }, [currentData, oneDayAgo]);

  const totalUnReadPrevious = React.useMemo(() => {
    const filteredData = currentData
      .filter((item: NotificationItemProps) => item.specific_type === 'NEW_MESSAGE')
      .map((item: NotificationItemProps) => item);
    if (!filteredData) return 0;

    return filteredData.filter((item: any) => {
      const createdAt = new Date(item.created_at);
      if (createdAt.getTime() < oneDayAgo) {
        return item.read_status === false;
      }
      return false;
    }).length;
  }, [currentData, oneDayAgo]);

  const totalToday = React.useMemo(
    () =>
      currentData?.filter((item: any) => {
        const createdAt = new Date(item.created_at);
        const isRead = item.read_status;
        if (createdAt.getTime() >= oneDayAgo && isRead === false) {
          return item;
        }
        return false;
      }),
    [currentData, oneDayAgo]
  );

  console.log({
    message: currentData.filter((item) => item.specific_type === 'NEW_MESSAGE'),
    totalToday,
    data,
  });

  const totalPrevious = React.useMemo(() => {
    if (!currentData) return [];

    return currentData?.filter((item: any) => {
      const createdAt = new Date(item.created_at);
      if (createdAt.getTime() < oneDayAgo) {
        return item;
      }
      return false;
    });
  }, [currentData, oneDayAgo]);

  // console.log('totalUnRead', totalUnRead);
  // console.log('totalUnReadToday', totalUnReadToday);
  // console.log('totalUnReadPrevious', totalUnReadPrevious);
  // console.log('totalToday', totalToday);
  // console.log('totalPrevious', totalPrevious);

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert severity="error" onClose={handleCloseAlert} sx={{ width: '100%' }}>
          ...Opss, in message popover component something went wrong
        </Alert>
      </Snackbar>
      <IconButtonAnimate
        disabled={!FEATURE_NOTIFICATION_SYSTEM}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        {messageNotifyCount && messageNotifyCount > 0 ? (
          <Badge badgeContent={messageNotifyCount} color="primary">
            <SvgIconStyle
              src={`/assets/icons/dashboard-header/message-bar.svg`}
              sx={{ width: 25, height: 25, color: '#000' }}
            />
          </Badge>
        ) : (
          <SvgIconStyle
            src={`/assets/icons/dashboard-header/message-bar.svg`}
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
                    <React.Fragment>
                      <Box>
                        {translate('notification.today')}
                        {totalUnReadToday > 0 && (
                          <Typography
                            component="span"
                            sx={{
                              backgroundColor: '#13B2A2',
                              color: '#fff',
                              ml: 1,
                              borderRadius: '100%',
                              px: 1,
                              fontSize: 12,
                            }}
                          >
                            {totalUnReadToday}
                          </Typography>
                        )}
                      </Box>
                    </React.Fragment>
                  }
                  value="1"
                />
                <Tab
                  label={
                    <React.Fragment>
                      <Box>
                        {translate('notification.previous')}
                        {totalUnReadPrevious > 0 && (
                          <Typography
                            component="span"
                            sx={{
                              backgroundColor: '#13B2A2',
                              color: '#fff',
                              ml: 1,
                              borderRadius: '100%',
                              px: 1,
                              fontSize: 12,
                            }}
                          >
                            {totalUnReadPrevious}
                          </Typography>
                        )}
                      </Box>
                    </React.Fragment>
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
              {messageNotifyCount > 0 && (
                <React.Fragment>
                  {/* <Tooltip title=" Mark all as read"> */}
                  <Button variant="text" color="primary" onClick={handleMarkAllAsRead}>
                    <Iconify icon="eva:done-all-fill" width={20} height={20} />
                    <Typography sx={{ ml: 0.5 }}>{translate('notification.read_all')}</Typography>
                  </Button>
                  {/* </Tooltip> */}
                </React.Fragment>
              )}

              <Button variant="text" color="error" onClick={handleClearAll}>
                <Typography sx={{ ml: 0.5 }}>{translate('notification.clear_all')}</Typography>
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', mb: '10px' }} />
          <TabPanel value="1" sx={{ maxHeight: 350, overflowY: 'auto' }}>
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              <List disablePadding>
                <React.Fragment>
                  {currentData && totalToday?.length > 0 ? (
                    <React.Fragment>
                      {currentData &&
                        currentData
                          .filter(
                            (item) =>
                              item.specific_type === 'NEW_MESSAGE' && item.read_status === false
                          )
                          .map((item: NotificationItemProps, index: any) => (
                            <NotificationItem
                              key={index}
                              message={item}
                              tabValue={activeTap}
                              handleClose={handleClose}
                            />
                          ))}
                    </React.Fragment>
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
                </React.Fragment>
              </List>
            </Scrollbar>

            {/* <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1 }}>
              <Button fullWidth disableRipple>
                {translate('view_all')}
              </Button>
            </Box> */}
          </TabPanel>
          <TabPanel value="2" sx={{ maxHeight: 350, overflowY: 'auto' }}>
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              <List disablePadding>
                <React.Fragment>
                  {currentData && totalPrevious?.length > 0 ? (
                    <React.Fragment>
                      {currentData &&
                        currentData
                          .filter((item) => item.specific_type === 'NEW_MESSAGE')
                          .map((item: NotificationItemProps, index: any) => (
                            <NotificationItem key={index} message={item} tabValue={activeTap} />
                          ))}
                    </React.Fragment>
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
                </React.Fragment>
              </List>
            </Scrollbar>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <Box sx={{ p: 1 }}>
              <Button fullWidth disableRipple>
                {translate('view_all')}
              </Button>
            </Box> */}
          </TabPanel>
        </TabContext>
      </MenuPopover>
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

// type NotificationItemProps = {
//   id: string;
//   data: string;
//   createdAt: Date;
//   isUnRead: boolean;
//   senderName: string;
// };

function NotificationItem({
  message,
  tabValue,
  handleClose,
}: {
  message: NotificationItemProps;
  tabValue: any;
  handleClose?: () => void;
}) {
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  // for url redirect open message
  const location = useLocation();
  const path = location.pathname.split('/');
  const urlToMessage = `/${path[1]}/${path[2]}/messages`;
  const roomId = message?.message?.room_id || '';

  // const { description } = renderContent(message);
  const { translate, currentLang } = useLocales();

  const oneDay = 24 * 60 * 60 * 1000;
  const oneDayAgo = Date.now() - oneDay;

  const createdAt = new Date(message.created_at);

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

  const handleMarkRead = async () => {
    await axiosInstance.patch(
      'tender/notification/read',
      { notificationId: message.id },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
  };

  const handleOpenMessage = () => {
    dispatch(setActiveConversationId(roomId));
    navigate(urlToMessage);
    if (handleClose) {
      handleClose();
    }
    if (message.read_status === false) {
      handleMarkRead();
    }
  };

  return (
    <React.Fragment>
      {tabValue === '1' ? (
        <React.Fragment>
          {createdAt.getTime() >= oneDayAgo && (
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(message.read_status && {
                  bgcolor: 'action.selected',
                }),
              }}
            >
              {/* <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
              </ListItemAvatar> */}
              <ListItemText
                onClick={handleOpenMessage}
                primary={translate(`${subject(message.subject)}`)}
                secondary={
                  <Stack direction="column">
                    <Typography>
                      {(message && message.message && message.message.content) ?? message.content}
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
                      {/* {fToNow(message.message.created_at)} */}
                      {moment(message.created_at).locale(`${currentLang.value}`).fromNow()}
                    </Typography>
                  </Stack>
                }
              />
            </ListItemButton>
            // {/* )} */}
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ListItemButton
            sx={{
              py: 1.5,
              px: 2.5,
              mt: '1px',
              ...(message.read_status && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            {/* <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar> */}
            <ListItemText
              onClick={handleOpenMessage}
              primary={translate(`${subject(message.subject)}`)}
              secondary={
                <Stack direction="column">
                  <Typography>
                    {(message && message.message && message.message.content) ?? message.content}
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
                    {moment(message.created_at).locale(`${currentLang.value}`).fromNow()}
                  </Typography>
                </Stack>
              }
            />
          </ListItemButton>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

function renderContent(message: NotificationItemProps) {
  const description = (
    <Typography variant="subtitle2">
      {/* {message.data} */}
      {/* <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography> */}
    </Typography>
  );
  return {
    // avatar: <img alt={message.data} src="/icons/sender-icon.svg" />,
    description,
  };
}
