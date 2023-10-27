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
import {
  messageNotificationCount,
  messageListPopover,
} from '../../../queries/commons/subMessageNotificationCount';
import { setMessageNotifyCount } from '../../../redux/slices/notification';
import { dispatch, useDispatch, useSelector } from '../../../redux/store';
import axiosInstance from '../../../utils/axios';
import { useLocation, useNavigate } from 'react-router';
import { setActiveConversationId } from '../../../redux/slices/wschat';
import { Message } from '../../../@types/wschat';
import { setFiltered } from 'redux/slices/searching';

// ----------------------------------------------------------------------

export default function MessagePopover() {
  const { translate } = useLocales();

  const [currentData, setCurrentData] = useState<Message[] | []>([]);

  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [activeTap, setActiveTap] = useState('1');

  const [openAlert, setOpenAlert] = useState(false);

  const { user, activeRole } = useAuth();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setFiltered(''));
    setOpen(event.currentTarget);
  };

  const [notifCount] = useSubscription({
    query: messageNotificationCount,
    variables: { user_id: user?.id },
  });

  const [messageData] = useSubscription({
    query: messageListPopover,
    variables: { user_id: user?.id },
  });

  const { data: dataNotifCount, fetching: fetchingNotifCount, error: notifCountError } = notifCount;
  const { data: dataResult, fetching: fetchingResult, error: errorResult } = messageData;

  useEffect(() => {
    if (FEATURE_NOTIFICATION_SYSTEM) {
      if (!fetchingResult && dataResult) {
        setCurrentData(dataResult.message);
      }
    }
  }, [dataResult, fetchingResult]);

  const handleClose = () => {
    setOpen(null);
  };

  // const handleMarkAllAsRead = async () => {
  //   await axiosInstance.patch(
  //     'tender/notification/read-mine',
  //     { type: 'message' },
  //     {
  //       headers: { 'x-hasura-role': activeRole! },
  //     }
  //   );
  // };

  const handleTapChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTap(newValue);
  };

  // const handleClearAll = async () => {
  //   await axiosInstance.patch(
  //     'tender/notification/delete-all-mine',
  //     { type: 'message' },
  //     {
  //       headers: { 'x-hasura-role': activeRole! },
  //     }
  //   );
  // };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const oneDay = 24 * 60 * 60 * 1000;
  const oneDayAgo = Date.now() - oneDay;

  const totalToday = React.useMemo(
    () =>
      currentData?.filter((item: any) => {
        const createdAt = new Date(item.created_at);
        const isRead = item.read_status;
        if (createdAt.getTime() >= oneDayAgo) {
          return item;
        }
        return false;
      }),
    [currentData, oneDayAgo]
  );

  const totalUnReadToday = React.useMemo(() => {
    const filteredData = currentData;

    if (!filteredData.length) return 0;

    return filteredData.filter((item: any) => {
      const createdAt = new Date(item.created_at);
      if (createdAt.getTime() >= oneDayAgo) {
        return item.read_status === false;
      }
      return false;
    }).length;
  }, [currentData, oneDayAgo]);

  const totalUnReadPrevious = React.useMemo(() => {
    const filteredData = currentData;
    if (!filteredData) return 0;

    return filteredData.filter((item: any) => {
      const createdAt = new Date(item.created_at);
      if (createdAt.getTime() < oneDayAgo) {
        return item.read_status === false;
      }
      return false;
    }).length;
  }, [currentData, oneDayAgo]);

  const totalPrevious = React.useMemo(
    () =>
      currentData?.filter((item: any) => {
        const createdAt = new Date(item.created_at);
        if (createdAt.getTime() < oneDayAgo) {
          return item;
        }
        return false;
      }),
    [currentData, oneDayAgo]
  );

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
        <Badge
          badgeContent={dataNotifCount && dataNotifCount.message_aggregate.aggregate.count}
          color="primary"
        >
          <SvgIconStyle
            src={`/assets/icons/dashboard-header/message-bar.svg`}
            sx={{ width: 25, height: 25, color: '#000' }}
          />
        </Badge>
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
              <Typography variant="subtitle1">
                {translate('notification.message_header')}
              </Typography>
              <TabList value={activeTap} onChange={handleTapChange}>
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

            {/* <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'end',
              }}
            >
              {dataNotifCount && dataNotifCount.message_aggregate.aggregate.count > 0 && (
                <React.Fragment>
                  <Button variant="text" color="primary" onClick={handleMarkAllAsRead}>
                    <Iconify icon="eva:done-all-fill" width={20} height={20} />
                    <Typography sx={{ ml: 0.5 }}>{translate('notification.read_all')}</Typography>
                  </Button>
                </React.Fragment>
              )}
              <Button variant="text" color="error" onClick={handleClearAll}>
                <Typography sx={{ ml: 0.5 }}>{translate('notification.clear_all')}</Typography>
              </Button>
            </Box> */}
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
                          // .filter((v) => v.read_status === false)
                          .map((item: Message, index: any) => (
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
                      <ListItemText
                        primary={translate(`notification.no_message_notifications_today`)}
                      />
                    </ListItemButton>
                  )}
                </React.Fragment>
              </List>
            </Scrollbar>
          </TabPanel>
          <TabPanel value="2" sx={{ maxHeight: 350, overflowY: 'auto' }}>
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              <List disablePadding>
                <React.Fragment>
                  {totalPrevious?.length > 0 ? (
                    <React.Fragment>
                      {totalPrevious &&
                        totalPrevious.map((item: Message, index: any) => (
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
                      <ListItemText primary={translate(`notification.no_notifications`)} />
                    </ListItemButton>
                  )}
                </React.Fragment>
              </List>
            </Scrollbar>

            <Divider sx={{ borderStyle: 'dashed' }} />
          </TabPanel>
        </TabContext>
      </MenuPopover>
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({
  message,
  tabValue,
  handleClose,
}: {
  message: Message;
  tabValue: any;
  handleClose?: () => void;
}) {
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/');
  const urlToMessage = `/${path[1]}/${path[2]}/messages`;
  const roomId = message?.room_id || '';

  const { translate, currentLang } = useLocales();

  const oneDay = 24 * 60 * 60 * 1000;
  const oneDayAgo = Date.now() - oneDay;

  const createdAt = new Date(message.created_at!);

  const subject = (value: string) => {
    let tempSubject = '';
    if (value === 'TEXT') {
      tempSubject = 'notification.message.text';
    } else if (value === 'IMAGE') {
      tempSubject = 'notification.message.image';
    } else if (value === 'FILE') {
      tempSubject = 'notification.message.text';
    } else {
      tempSubject = value;
    }

    return tempSubject;
  };

  const handleReadMessages = async (conversationId: string) => {
    await axiosInstance.patch(
      '/tender/messages/toogle-read',
      {
        roomId: conversationId,
      },
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
      handleReadMessages(roomId);
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
                ...(!message.read_status && {
                  fontWeight: 700,
                }),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'start',
              }}
              onClick={handleOpenMessage}
            >
              <Typography variant="body1">{message.sender?.employee_name}</Typography>
              <Typography variant="body2">
                {`${subject(translate(`${subject(message.content_type_id!)}`))}`}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.disabled',
                }}
                component="span"
              >
                {moment(message.created_at).locale(`${currentLang.value}`).fromNow()}
              </Typography>
            </ListItemButton>
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
              ...(!message.read_status && {
                fontWeight: 700,
              }),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'start',
            }}
            onClick={handleOpenMessage}
          >
            <Typography variant="body1">{message.sender?.employee_name}</Typography>
            <Typography variant="body2">
              {`${subject(translate(`${subject(message.content_type_id!)}`))}`}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
              component="span"
            >
              {moment(message.created_at).locale(`${currentLang.value}`).fromNow()}
            </Typography>
          </ListItemButton>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
