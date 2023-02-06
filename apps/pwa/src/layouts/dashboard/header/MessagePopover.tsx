import { noCase } from 'change-case';
import React, { useState, useEffect, Key } from 'react';
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
// utils
import { fToNow } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import SvgIconStyle from 'components/SvgIconStyle';
import { sub } from 'date-fns';
import useLocales from '../../../hooks/useLocales';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  subNotification,
  subNotificationClient,
  notifAccManager,
} from 'queries/commons/subNotification';
import useAuth from 'hooks/useAuth';
import { useSubscription } from 'urql';
import Page500 from 'pages/Page500';
import { FEATURE_NOTIFICATION_SYSTEM } from 'config';

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

  const [result] = useSubscription(currentSubcription);

  const { data, fetching, error } = result;

  const memoResult = React.useMemo(() => data, [data]);
  const memoResultError = React.useMemo(() => error, [error]);

  // console.log(memoResult, 'RESULT');

  useEffect(() => {
    if (FEATURE_NOTIFICATION_SYSTEM) {
      if (!fetching && memoResult) {
        setCurrentData(memoResult.notification);
      }

      // if (!fetching && memoResultError) {
      //   setOpenAlert(true);
      // }
    }
  }, [data, currentData, fetching, memoResult, memoResultError]);

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setMessages(
      messages.map((message) => ({
        ...message,
        isUnRead: false,
      }))
    );
  };

  const handleTapChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTap(newValue);
  };

  const handleClearAll = () => {};

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
    if (!currentData) return 0;

    return currentData?.filter((item: any) => {
      const createdAt = new Date(item?.message?.created_at);

      if (createdAt.getTime() >= oneDayAgo) {
        return item?.message?.read_status === false;
      }
      return false;
    }).length;
  }, [currentData, oneDayAgo]);

  const totalUnReadPrevious = React.useMemo(() => {
    if (!currentData) return 0;

    return currentData?.filter((item: any) => {
      const createdAt = new Date(item?.message?.created_at);

      if (createdAt.getTime() < oneDayAgo) {
        return item?.message?.read_status === false;
      }

      return false;
    }).length;
  }, [currentData, oneDayAgo]);

  const totalToday = React.useMemo(
    () =>
      currentData?.filter((item: any) => {
        const createdAt = new Date(item?.message?.created_at);

        if (createdAt.getTime() >= oneDayAgo) {
          return item?.message;
        }
        return false;
      }),
    [currentData, oneDayAgo]
  );

  const totalPrevious = React.useMemo(
    () =>
      currentData?.filter((item: any) => {
        const createdAt = new Date(item?.message?.created_at);

        if (createdAt.getTime() < oneDayAgo) {
          return item?.message;
        }
        return false;
      }),
    [currentData, oneDayAgo]
  );

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
        {totalUnRead > 0 ? (
          <Badge badgeContent={totalUnRead} color="primary">
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
            {/* <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">الرسائل</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              لديك {totalUnRead} رسائل غير مقروئة
            </Typography>
          </Box> */}

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
              {totalUnRead > 0 && (
                <React.Fragment>
                  {/* <Tooltip title=" Mark all as read"> */}
                  <IconButton color="primary" onClick={handleMarkAllAsRead}>
                    <Iconify icon="eva:done-all-fill" width={20} height={20} />
                    <Typography sx={{ ml: 0.5 }}>{translate('notification.read_all')}</Typography>
                  </IconButton>
                  {/* </Tooltip> */}
                </React.Fragment>
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
                <React.Fragment>
                  {currentData && totalToday?.length > 0 ? (
                    <React.Fragment>
                      {currentData &&
                        currentData.map((item: NotificationItemProps, index: any) => (
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
                        currentData.map((item: NotificationItemProps, index: any) => (
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
}: {
  message: NotificationItemProps;
  tabValue: any;
}) {
  // const { description } = renderContent(message);

  const oneDay = 24 * 60 * 60 * 1000;
  const oneDayAgo = Date.now() - oneDay;

  const createdAt = new Date(message.message.created_at);
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
                ...(message.message.read_status && {
                  bgcolor: 'action.selected',
                }),
              }}
            >
              {/* <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
              </ListItemAvatar> */}
              <ListItemText
                primary={message.message.sender.email}
                secondary={
                  <Stack direction="column">
                    <Typography>{message.message.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      {fToNow(message.message.created_at)}
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
              ...(message.message.read_status && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            {/* <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar> */}
            <ListItemText
              primary={message.message.sender.email}
              secondary={
                <Stack direction="column">
                  <Typography>{message.message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {fToNow(message.message.created_at)}
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
